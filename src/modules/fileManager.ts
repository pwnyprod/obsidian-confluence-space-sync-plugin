import { Vault, TFile, TFolder } from "obsidian";
import { MarkdownManager } from "../modules/markdownManager";
import { ConfluenceSpacesListPage } from "../definition/confluenceTypes";

export function sanitizeFileName(title: string): string {
  const normalizedTitle = title.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const sanitizedTitle = normalizedTitle.replace(/[\/\?<>\\:\*\|":]/g, '-');
  const noSpacesTitle = sanitizedTitle.replace(/\s+/g, '-');
  const noDoubleDashTitle = noSpacesTitle.replace(/--+/g, '-');
  const trimmedTitle = noDoubleDashTitle.replace(/^-+|-+$/g, '');
  return trimmedTitle || 'untitled';
}


export class FileManager {
  private vault: Vault;
  private markdownManager: MarkdownManager;
  confluenceBaseUri: string;

  constructor(vault: Vault, confluenceBaseUri: string) {
    this.confluenceBaseUri = confluenceBaseUri;
    this.vault = vault;
    this.markdownManager = new MarkdownManager();

    this.markdownManager.loadPlugins('plugins').catch(err => {
      console.error("Fehler beim Laden der Plugins:", err);
    });
  }

  async savePageAsMarkdown(page: ConfluenceSpacesListPage, content: string, folderPath: string): Promise<void> {
    let markdownContent = this.markdownManager.convertHtmlToMarkdown(content);

    const relativePath = folderPath.replace(/^\//, '').replace(/\/$/, '');
    const folderSplit = folderPath.split('/')
    const linkedFiles: string[] = []
    for await (const file of this.vault.getFiles()) {
      if (folderSplit.includes(sanitizeFileName(file.basename))) {
        linkedFiles.push(`[[${file.name}]]`)
      }
    }

    markdownContent = await this.markdownManager.addMetaDataToMarkdown(markdownContent, {
      title: page.title,
      pageId: page.id,
      link: `${this.confluenceBaseUri}${page._links.webui}`,
      creator: page.version?.by.displayName ?? '',
      contributors: page.version?.collaborators?.users ?? [],
      path: relativePath,
      linkedFiles: linkedFiles,
      tags: page.metadata?.labels?.results.map(value => `${value.name}`) ?? []
    });

    const sanitizedTitle = sanitizeFileName(page.title);
    const filePath = `${folderPath}/${sanitizedTitle}.md`;

    const file = this.vault.getAbstractFileByPath(filePath) as TFile;
    const folder = this.vault.getFolderByPath(folderPath);

    if (!folder) {
      await this.vault.createFolder(folderPath);
    }

    if (file) {
      await this.vault.modify(file, markdownContent);
    } else {
      await this.vault.create(filePath, markdownContent);
    }
  }

  async deleteObsoletePage(pageTitle: string, folderPath: string): Promise<void> {
    const sanitizedTitle = sanitizeFileName(pageTitle);
    const filePath = `${folderPath}/${sanitizedTitle}.md`;

    const file = this.vault.getAbstractFileByPath(filePath) as TFile;
    if (file) {
      await this.vault.delete(file);
    }
  }
}

export function getFolderPaths(vault: Vault): string[] {
  const folderPaths: string[] = [];

  const getFoldersRecursively = (folder: TFolder) => {
    folderPaths.push(folder.path);
    for (const child of folder.children) {
      if (child instanceof TFolder) {
        getFoldersRecursively(child);
      }
    }
  };

  const rootFolder = vault.getRoot();
  getFoldersRecursively(rootFolder);

  return folderPaths;
}