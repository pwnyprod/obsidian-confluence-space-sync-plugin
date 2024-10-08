import TurndownService from 'turndown';
import { Plugin } from '../definition/pluginLoader';

// Plugin für <ul> (ungeordnete Liste)
export class UnorderedListPlugin implements Plugin {
  initialize(turndownService: TurndownService): void {
    turndownService.addRule('unordered-list', {
      filter: 'ul',
      replacement: (content) => `\n${content}\n`
    });

    turndownService.addRule('list-item', {
      filter: 'li',
      replacement: (content) => `- ${content}\n`
    });
  }

  postProcess(markdown: string): string {
    return markdown;
  }
}
