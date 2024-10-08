import { Plugin } from '../definition/pluginLoader';
import TurndownService from 'turndown';

export class TablePlugin implements Plugin {
  initialize(turndownService: TurndownService): void {
    turndownService.addRule('table', {
      filter: 'table',
      replacement: (content) => {
        return `\n${content.trim()}\n`;
      }
    });

    turndownService.addRule('table-row', {
      filter: 'tr',
      replacement: (content, node) => {
        const cells = Array.from(node.childNodes)
          .filter(n => n.nodeName === 'TD' || n.nodeName === 'TH')
          .map(n => this.getTextContent(n));

        return `| ${cells.join(' | ')} |\n|${cells.map(() => '---').join(' | ')}|\n`;
      }
    });

    turndownService.addRule('table-header', {
      filter: 'th',
      replacement: (content, node) => {
        const contentText = this.getTextContent(node as ChildNode).trim();
        return contentText;
      }
    });

    turndownService.addRule('table-data', {
      filter: 'td',
      replacement: (content, node) => {
        const contentText = this.getTextContent(node as ChildNode).trim();
        return contentText;
      }
    });

    turndownService.addRule('table-head', {
      filter: 'thead',
      replacement: (content, node) => {
        const headers = Array.from(node.querySelectorAll('th')).map(th => this.getTextContent(th).trim());
        const headerRow = `| ${headers.join(' | ')} |\n`;
        const separator = ''// `| ${headers.map(() => '---').join(' | ')} |\n`;

        return `${headerRow}${separator}`;
      }
    });

    turndownService.addRule('table-body', {
      filter: 'tbody',
      replacement: (content) => {
        return `${content.trim()}\n`;
      }
    });
  }

  private getTextContent(node: ChildNode): string {
    let text = '';
    node.childNodes.forEach(child => {
      if (child.nodeType === 3) {
        text += child.textContent || '';
      } else if (child.nodeType === 1) {
        text += this.getTextContent(child);
      }
    });
    return text;
  }

  postProcess(markdown: string): string {
    return markdown;
  }
}