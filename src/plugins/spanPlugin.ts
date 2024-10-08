import { Plugin } from '../definition/pluginLoader';
import TurndownService from 'turndown';

export class SpanPlugin implements Plugin {
  initialize(turndownService: TurndownService): void {
    turndownService.addRule('span', {
      filter: 'span',
      replacement: (content) => {
        return `${content}`;
      }
    });
  }

  postProcess(markdown: string): string {
    return markdown;
  }
}