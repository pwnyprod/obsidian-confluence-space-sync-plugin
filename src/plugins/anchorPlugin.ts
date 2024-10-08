import { Plugin } from '../definition/pluginLoader';
import TurndownService from 'turndown';

// Plugin für <a> (Link)
export class AnchorPlugin implements Plugin {
  initialize(turndownService: TurndownService): void {
    turndownService.addRule('anchor', {
      filter: 'a',
      replacement: (content, node) => {
        const href = (node as HTMLAnchorElement).getAttribute('href');
        return href ? `[${content}](${href})` : content;
      }
    });
  }

  postProcess(markdown: string): string {
    return markdown;
  }
}
