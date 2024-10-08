import { Plugin } from '../definition/pluginLoader';
import TurndownService from 'turndown';

export class TimePlugin implements Plugin {
  initialize(turndownService: TurndownService): void {
    turndownService.addRule('time', {
      filter: 'time',
      replacement: (_content, node: HTMLElement) => {
        const dueDate = node ? `${node.getAttribute('datetime')}` : 'error';
        return `{{ date:${dueDate} }}`;
      }
    });
  }

  postProcess(markdown: string): string {
    return markdown;
  }
}