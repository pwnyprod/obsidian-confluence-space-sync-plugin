import { Plugin } from '../definition/pluginLoader';
import TurndownService from 'turndown';

export class ConfluenceMacroPlugin implements Plugin {
    initialize(turndownService: TurndownService): void {
        turndownService.addRule('confluence-macro', {
            filter: ['ac:structured-macro'],
            replacement: (content, node) => {
              const macroName = (node as HTMLElement).getAttribute('ac:name');
              if (macroName) {
                return `\n**Confluence macro: ${macroName}**\n\n${content}\n\n`;
              }
              return content;
            }
          });
    }
    postProcess(markdown: string): string {
        return markdown;
    }

}

declare global {
  interface HTMLElementTagNameMap {
    'ac:structured-macro': HTMLElement;
  }
}