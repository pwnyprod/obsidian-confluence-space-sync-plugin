import { Plugin } from '../definition/pluginLoader';
import TurndownService from 'turndown';

export class TaskListPlugin implements Plugin {
  initialize(turndownService: TurndownService): void {
    turndownService.addRule('ac-task', {
      filter: (node: HTMLElement) => {
        return node.nodeName === 'AC:TASK';
      },
      replacement: (_content, node: HTMLElement) => {
        const spanContent = node.querySelector('.placeholder-inline-tasks')?.textContent?.trim() || '';
        const timeElement = node.querySelector('time');
        const dueDate = timeElement ? `${timeElement.getAttribute('datetime')}` : 'now';

        return `- [ ] ${spanContent} \`= date(${dueDate})\`\n`;
      }
    });

    turndownService.addRule('ac-task-obsolet', {
      filter: (node: HTMLElement) => {
        return ['AC:TASK-ID', 'AC:TASK-UUID', 'AC:TASK-STATUS'].includes(node.nodeName);
      },
      replacement: (_content) => {
        return '';
      }
    });

    turndownService.addRule('ac-task-clear', {
      filter: (node: HTMLElement) => {
        return ['AC:TASK-LIST', 'AC:TASK-BODY'].includes(node.nodeName);
      },
      replacement: (content) => {
        return content.trim();
      }
    });
  }

  postProcess(markdown: string): string {
    return markdown.trim();
  }
}


declare global {
  interface HTMLElementTagNameMap {
    'ac:task': HTMLElement;
  }
}