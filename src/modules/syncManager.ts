// src/syncManager.ts

import { Vault } from "obsidian";
import { ConfluenceAPIClient } from "./apiClient";
import { FileManager, sanitizeFileName } from "./fileManager";
import { PageType } from "../definition/confluenceTypes";
import { MINUTE_SPAN_ID } from "src/main";

export class PageSyncManager {
  private confluenceClient: ConfluenceAPIClient;
  private fileManager: FileManager;
  private vault: Vault;
  private syncedPages: Set<string>;
  private syncInterval: number;
  private intervalID: any;

  constructor(confluenceClient: ConfluenceAPIClient, fileManager: FileManager, vault: Vault, syncInterval: number) {
    this.confluenceClient = confluenceClient;
    this.fileManager = fileManager;
    this.vault = vault;
    this.syncedPages = new Set();
    this.syncInterval = syncInterval;
  }

  startScheduledSync(spaceKey: string, targetFolderPath: string, syncInterval: number) {
    this.stopSync();

    this.syncInterval = syncInterval;

    this.syncSpace(spaceKey, targetFolderPath);

    this.intervalID = setInterval(() => {
      this.syncSpace(spaceKey, targetFolderPath);
      this.updateSyncStatus()
    }, this.syncInterval * 60 * 1000);
  }

  updateSyncStatus() {
    const minuteSpan = document.getElementById(MINUTE_SPAN_ID)
    if (minuteSpan === null) {
      return
    }

    minuteSpan.textContent = '0'
  }

  stopSync() {
    if (this.intervalID) {
      clearInterval(this.intervalID);
      this.intervalID = null;
    }
  }

  async syncSpace(spaceKey: string, targetFolderPath: string): Promise<void> {
    try {
      const pages = await this.confluenceClient.fetchPagesInSpace(spaceKey);
      this.syncedPages.clear();

      for (const page of pages.page.results) {
        await this.processPageRecursively(page, targetFolderPath);
      }

      await this.cleanObsoletePages(targetFolderPath);
    } catch (error) {
      console.error("Error during space synchronization:", error);
    }
  }

  private async processPageRecursively(page: PageType, currentFolderPath: string) {
    const sanitizedTitle = sanitizeFileName(page.title);
    
    const content = await this.confluenceClient.fetchPageContent(page.id);
    
    const childPages = await this.confluenceClient.fetchChildPages(page.id);
    let pageFolderPath = currentFolderPath;
    if (childPages.size > 0) {
      pageFolderPath = `${currentFolderPath}/${sanitizedTitle}`;
    }
  
    await this.fileManager.savePageAsMarkdown(page, content.body?.storage.value ?? '', pageFolderPath);
    this.syncedPages.add(sanitizedTitle);
  
    if (childPages.size > 0) {
      for (const childPage of childPages.results) {
        await this.processPageRecursively(childPage, pageFolderPath);
      }
    }
  }
  

  private async cleanObsoletePages(targetFolderPath: string): Promise<void> {
    const files = await this.vault.adapter.list(targetFolderPath);
    if (files.files && files.files.length > 0) {
      for (const file of files.files) {
        const fileName = file.split('/').pop() || '';
        const pageTitle = this.extractPageTitleFromFile(fileName);
        if (pageTitle && !this.syncedPages.has(pageTitle)) {
          console.log(`Obsoled Page cleared: ${pageTitle}`)
          await this.fileManager.deleteObsoletePage(pageTitle, targetFolderPath);
        }
      }
    }
  }

  private extractPageTitleFromFile(fileName: string): string | null {
    if (!fileName.endsWith('.md')) {
      return null;
    }
    return fileName.replace(/\.md$/, '');
  }
}
