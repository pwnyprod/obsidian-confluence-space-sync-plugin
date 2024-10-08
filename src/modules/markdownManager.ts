import { Plugin } from '../definition/pluginLoader';
import { AnchorPlugin } from '../plugins/anchorPlugin';
import { BoldPlugin } from '../plugins/boldPlugin';
import { ConfluenceMacroPlugin } from '../plugins/confluenceMacro';
import { HeadingPlugin } from '../plugins/headingPlugin';
import { ParagraphPlugin } from '../plugins/paragraphPlugin';
import { ReportUnknownTagsPlugin } from '../plugins/reportUnknownTags';
import { TablePlugin } from '../plugins/tablePlugin';
import { TimePlugin } from '../plugins/timePlugin';
import { UnorderedListPlugin } from '../plugins/unorderedListPlugin';
import { CodePlugin } from '../plugins/codePlugin';
import TurndownService from 'turndown';
import { TaskListPlugin } from 'src/plugins/TaskListPlugin';
import { SpanPlugin } from 'src/plugins/spanPlugin';
import { CalloutPlugin } from 'src/plugins/calloutPlugin';

export class MarkdownManager {
  private turndownService: TurndownService;
  private plugins: Plugin[] = [];

  constructor() {
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      bulletListMarker: '-',
      codeBlockStyle: 'fenced'
    });
  }

  async loadPlugins(pluginFolder: string): Promise<void> {
    this.plugins = this.getPluginModules();
    for (const plugin of this.plugins) {
      plugin.initialize(this.turndownService);
    }
  }

  convertHtmlToMarkdown(html: string): string {
    let markdown = this.turndownService.turndown(html);

    for (const plugin of this.plugins) {
      markdown = plugin.postProcess(markdown);
    }

    return markdown;
  }

  async addMetaDataToMarkdown(markdown: string, metaData: {[key: string]: string|Array<string>}): Promise<string> {
    const yamlFrontmatter = this.createYamlFrontmatter(metaData);
    return `${yamlFrontmatter}\n${markdown}`;
  }

  private createYamlFrontmatter(metaData: {[key: string]: string|Array<string>}): string {
    let yaml = '---\n';
  
    for (const key in metaData) {
      if (typeof metaData[key] === 'string') {
        yaml += `${key}: ${metaData[key]}\n`
      } else {
        yaml += `${key}:\n`
        for (const tags of metaData[key]) {
          yaml += `  - "${tags}"\n`
        }
      }
    }
    
    yaml += '---\n';
  
    return yaml;
  }

  private getPluginModules(): Plugin[] {
    return [
      new TaskListPlugin(),
      new CalloutPlugin(),
      new AnchorPlugin(),
      new BoldPlugin(),
      new HeadingPlugin(),
      new ParagraphPlugin(),
      new TablePlugin(),
      new TimePlugin(),
      new UnorderedListPlugin(),
      new CodePlugin(),
      new SpanPlugin(),
    ];
  }
}
  