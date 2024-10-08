import { Plugin } from '../definition/pluginLoader';
import TurndownService from 'turndown';

export class ReportUnknownTagsPlugin implements Plugin {
  private reportedTags: Set<string> = new Set();
  private inReportCheck: boolean = false;

  initialize(turndownService: TurndownService): void {
    turndownService.addRule('report-unknown-tags', {
      filter: (node: HTMLElement) => {
        if (this.inReportCheck) {
          return false;
        }

        const tagName = node.tagName.toLowerCase();

        if (this.reportedTags.has(tagName)) {
          return false;
        }

        this.inReportCheck = true;

        const isKnownTag = turndownService.rules.array.some(rule => {
          if (typeof rule.filter === 'string') {
            return rule.filter.toLowerCase() === tagName;
          } else if (Array.isArray(rule.filter)) {
            return rule.filter.some(f => f.toLowerCase() === tagName);
          } else if (typeof rule.filter === 'function') {
            return rule.filter(node, {});
          }
          return false;
        });

        this.inReportCheck = false;

        return !isKnownTag;
      },
      replacement: (content, node) => {
        const tagName = node.nodeName.toLowerCase();

        if (!this.reportedTags.has(tagName)) {
          console.info(`Unbekanntes Tag gefunden: <${tagName}>`);
          console.info(node)
          this.reportedTags.add(tagName);
        }

        return `#unknown-tag <!-- ${tagName} macro: ${content} -->\n`;
      }
    });
  }

  postProcess(markdown: string): string {
    return markdown;
  }
}
