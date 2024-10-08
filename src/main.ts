import { Plugin } from "obsidian";
import { ConfluenceSyncSettings, DEFAULT_SETTINGS, SpaceConfig } from "./settings";
import { ConfluenceSyncSettingTab } from "./settingsTab";
import { ConfluenceAPIClient } from "./modules/apiClient";
import { FileManager } from "./modules/fileManager";
import { PageSyncManager } from "./modules/syncManager";

export const MINUTE_SPAN_ID = 'MINUTE_SPAN_ID'

export default class ConfluenceSyncPlugin extends Plugin {
  settings: ConfluenceSyncSettings = DEFAULT_SETTINGS;
  syncManagers: PageSyncManager[] = [];

  async onload() {
    console.log("Confluence Folder Sync Plugin loaded");

    await this.loadSettings();

    this.addSettingTab(new ConfluenceSyncSettingTab(this.app, this));

    this.addSyncStatus()

    if (this.settings.start) {
      this.initializeSyncManagers();
    }
  }

  addSyncStatus() {
    const statusBarItemEl = this.addStatusBarItem();

    // Erstelle ein Span-Element für den Minutenwert
    const minutesSpan = document.createElement('span');
    minutesSpan.id = MINUTE_SPAN_ID
    minutesSpan.textContent = '0'; // Initialer Wert 0 Minuten

    // Setze den Text der Statusleiste und füge den Span hinzu
    statusBarItemEl.setText('Confluence LastSync: ');
    statusBarItemEl.appendChild(minutesSpan);
    statusBarItemEl.appendText('min');

    // Intervall, um den Minutenwert regelmäßig neu auszulesen
    setInterval(() => {
      if (minutesSpan.textContent === null) {
        minutesSpan.textContent = '0'
      }
        let currentMinutes = parseInt(minutesSpan.textContent, 10);
        currentMinutes++;

        minutesSpan.textContent = currentMinutes.toString();
    }, 60000);
}

  initializeSyncManagers() {
    this.stopInitializedSyncManagers()

    const { confluenceBaseURL, apiToken, username, syncInterval, spaces } = this.settings;

    const confluenceClient = new ConfluenceAPIClient(
      confluenceBaseURL,
      apiToken,
      username
    );

    const fileManager = new FileManager(this.app.vault, this.settings.confluenceBaseURL);

    spaces.forEach((spaceConfig) => {
      const syncManager = new PageSyncManager(
        confluenceClient,
        fileManager,
        this.app.vault,
        syncInterval
      );
      syncManager.startScheduledSync(spaceConfig.spaceKey, spaceConfig.targetFolderPath, syncInterval);
      this.syncManagers.push(syncManager);
    });
  }

  stopInitializedSyncManagers() {
    this.syncManagers.forEach(manager => manager.stopSync());
    this.syncManagers = [];
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  onunload() {
    console.log("Confluence Folder Sync Plugin unloaded");
    this.stopInitializedSyncManagers();
  }
}
