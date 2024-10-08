import { Plugin } from '../definition/pluginLoader';
import TurndownService from 'turndown';

// Lokale Typendeklaration für 'code'
declare global {
  interface HTMLElementTagNameMap {
    'code': HTMLElement;
  }
}

export class CodePlugin implements Plugin {
  initialize(turndownService: TurndownService): void {
    // Regel für das `<code>`-Tag
    turndownService.addRule('inline-code', {
      filter: 'code',
      replacement: (content) => {
        // Markdown verwendet Backticks (`) für Inline-Code
        const contentText = (content || '').trim();
        return `\`\`\`\n${contentText}\n\`\`\``;
      }
    });
  }

  postProcess(markdown: string): string {
    return markdown;
  }
}