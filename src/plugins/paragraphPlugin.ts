import { Plugin } from '../definition/pluginLoader';
import TurndownService from 'turndown';

// Plugin für <p> (Absatz)
export class ParagraphPlugin implements Plugin {
  initialize(turndownService: TurndownService): void {
    turndownService.addRule('paragraph', {
      filter: 'p',
      replacement: (content) => `\n\n${content}\n\n`
    });
  }

  postProcess(markdown: string): string {
    return markdown;
  }
}
