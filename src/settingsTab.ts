import { App, PluginSettingTab, Setting, ButtonComponent, DropdownComponent, ToggleComponent } from "obsidian";
import ConfluenceSyncPlugin from "./main";
import { ConfluenceAPIClient } from "./modules/apiClient";
import { ConfluenceSpace } from "./definition/confluenceTypes";
import { FolderSuggest } from "./modules/suggester";
import { SpaceConfig } from "./settings";

export class ConfluenceSyncSettingTab extends PluginSettingTab {
  plugin: ConfluenceSyncPlugin;
  confluenceClient: ConfluenceAPIClient;

  constructor(app: App, plugin: ConfluenceSyncPlugin) {
    super(app, plugin);
    this.plugin = plugin;

    this.confluenceClient = new ConfluenceAPIClient(
      this.plugin.settings.confluenceBaseURL,
      this.plugin.settings.apiToken,
      this.plugin.settings.username
    );
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();
    containerEl.createEl("h2", { text: "Confluence Sync Plugin Settings" });

    new Setting(containerEl)
      .setName('Enable Sync')
      .setDesc('Toggle the active Status of the SyncManager (Warning: active syncs won`t be terminated)')
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.start)
          .onChange(async (value) => {
            console.log(value)
            this.plugin.settings.start = value
            await this.plugin.saveSettings();
            if (value === true) {
              this.plugin.initializeSyncManagers()
                console.info('Sync initialized')
            } else {
              this.plugin.stopInitializedSyncManagers()
              console.info('Sync stopped')
            }
          })
      )

    new Setting(containerEl)
      .setName("Confluence Base URL")
      .setDesc("The base URL of your Confluence instance.")
      .addText(text =>
        text
          .setPlaceholder("https://your-confluence-domain.atlassian.net/wiki")
          .setValue(this.plugin.settings.confluenceBaseURL)
          .onChange(async (value) => {
            this.plugin.settings.confluenceBaseURL = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("API Token")
      .setDesc("Your Confluence API token.")
      .addText(text =>
        text
          .setPlaceholder("Enter API token")
          .setValue(this.plugin.settings.apiToken)
          .onChange(async (value) => {
            this.plugin.settings.apiToken = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Username")
      .setDesc("Your Confluence username (usually an email address).")
      .addText(text =>
        text
          .setPlaceholder("Enter username")
          .setValue(this.plugin.settings.username)
          .onChange(async (value) => {
            this.plugin.settings.username = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Sync Interval (in minutes)")
      .setDesc("How often should the sync run (in minutes)?")
      .addText(text =>
        text
          .setPlaceholder("15")
          .setValue(this.plugin.settings.syncInterval.toString())
          .onChange(async (value) => {
            const numValue = parseInt(value);
            if (!isNaN(numValue)) {
              this.plugin.settings.syncInterval = numValue;
              await this.plugin.saveSettings();
            }
          })
      );

    containerEl.createEl("h3", { text: "Spaces to Sync" });

    this.plugin.settings.spaces.forEach((space, index) => {
      this.createSpaceSetting(containerEl, space, index);
    });

    new Setting(containerEl)
      .addButton((button: ButtonComponent) => {
        button
          .setButtonText("Add Space")
          .setCta()
          .onClick(() => {
            this.plugin.settings.spaces.push({ spaceKey: "", targetFolderPath: "" });
            this.plugin.saveSettings();
            this.display();
          });
      });
  }

  async createSpaceSetting(containerEl: HTMLElement, space: SpaceConfig, index: number) {
    const spaceDiv = containerEl.createDiv({ cls: 'space-setting-row' });

    const dropdown = new DropdownComponent(spaceDiv);

    const spaces = await this.confluenceClient.fetchSpaces();

    spaces.results.forEach((space: ConfluenceSpace) => {
      dropdown.addOption(space.key, space.name);
    });

    dropdown.setValue(space.spaceKey);

    dropdown.onChange(async (value) => {
      space.spaceKey = value;
      await this.plugin.saveSettings();
    });

    const textComponent = new Setting(spaceDiv)
      .setName('<- From Space to Target Folder ->')
      .addSearch((component) => {
        new FolderSuggest(component.inputEl, this.app);
        component
          .setPlaceholder("Target Folder Path")
          .setValue(space.targetFolderPath)
          .onChange(async (value) => {
            space.targetFolderPath = value;
            await this.plugin.saveSettings();
          })
      });

    const deleteButton = new ButtonComponent(spaceDiv);
    deleteButton
      .setIcon("trash")
      .setWarning()
      .setTooltip("Delete Space")
      .onClick(async () => {
        this.plugin.settings.spaces.splice(index, 1);
        await this.plugin.saveSettings();
        this.display();
      });
  }
}