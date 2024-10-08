import { Plugin } from '../definition/pluginLoader';
import TurndownService from 'turndown';

export class HeadingPlugin implements Plugin {
  initialize(turndownService: TurndownService): void {
    // Ersetze die Standardverarbeitung der <h>-Tags
    turndownService.addRule('custom-heading', {
      filter: (node: HTMLElement) => {
        // Überprüfe, ob es sich um ein <h1> bis <h6> Tag handelt
        return /^h[1-6]$/.test(node.tagName.toLowerCase());
      },
      replacement: (content, node) => {
        const level = parseInt(node.nodeName.charAt(1), 10);  // H1 => 1, H2 => 2, usw.
        
        // Benutzerdefinierte Formatierung für Überschriften
        const customMarkdownHeading = `${'#'.repeat(level)} ${content}\n\n`;
        return customMarkdownHeading;
      }
    });
  }

  postProcess(markdown: string): string {
    // Keine zusätzliche Post-Processing-Logik erforderlich
    return markdown;
  }
}
