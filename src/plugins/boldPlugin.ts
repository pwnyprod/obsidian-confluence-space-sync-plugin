import { Plugin } from '../definition/pluginLoader';
import TurndownService from 'turndown';

export class BoldPlugin implements Plugin {
  initialize(turndownService: TurndownService): void {
    turndownService.addRule('bold', {
      filter: 'strong',
      replacement: (content) => `**${content}**`
    });
  }

  postProcess(markdown: string): string {
    return markdown;
  }
}
