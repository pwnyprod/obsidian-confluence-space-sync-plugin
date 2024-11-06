import { Plugin } from '../definition/pluginLoader';
import TurndownService from 'turndown';

export class CalloutPlugin implements Plugin {
  initialize(turndownService: TurndownService): void {
    turndownService.addRule('callout-panel-type', {
      filter: (node: HTMLElement) => {
        return node.hasAttribute('data-panel-type');
      },
      replacement: replacementCalloutBody
    });
    
    turndownService.addRule('callout-panel-body', {
      filter: (node: HTMLElement) => {
        return node.classList.contains('panelContent');
      },
      replacement: (content, node: HTMLElement) => replacementCalloutBody(content, node.parentElement ?? node)
    });
  }

  postProcess(markdown: string): string {
    return markdown;
  }
}

function replacementCalloutBody(content: string, node: HTMLElement): string {
  const panelType = node.getAttribute('data-panel-type');
  const textContent = content.trim();

  switch (panelType) {
      case 'custom':
          return `\n> [!todo] **Custom Panel**:\n> ${textContent}\n`
      case 'info':
          return `\n> [!info] **Info Panel**:\n> ${textContent}\n`
      case 'note':
          return `\n> [!note] **Note Panel**:\n> ${textContent}\n`
      case 'success':
          return `\n> [!success] **Success Panel**:\n> ${textContent}\n`
      case 'warning':
          return `\n> [!warning] **Warning Panel**:\n> ${textContent}\n`
      case 'error':
          return `\n> [!error] **Error Panel**:\n> ${textContent}\n`
      default:
          return `\n> [!abstract] **Default Panel**:\n> ${textContent}\n`
  }
}