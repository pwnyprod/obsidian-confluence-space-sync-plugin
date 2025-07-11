import { describe, it, expect, beforeEach } from 'vitest';
import { MarkdownManager } from '../../src/modules/markdownManager';

// Dummy plugin to test plugin integration
class DummyPlugin {
  initialized = false;
  initialize(turndownService: any) {
    this.initialized = true;
  }
  postProcess(markdown: string): string {
    return markdown + ' processed';
  }
}

// Correctly override getPluginModules with protected modifier
class TestMarkdownManager extends MarkdownManager {
  protected getPluginModules(): any[] {
    return [new DummyPlugin()];
  }
}

describe('MarkdownManager', () => {
  let markdownManager: TestMarkdownManager;

  beforeEach(() => {
    markdownManager = new TestMarkdownManager();
  });

  it('should initialize plugins on loadPlugins', async () => {
    await markdownManager.loadPlugins('');
    const plugins = (markdownManager as any).plugins;
    expect(plugins.length).toBe(1);
    expect(plugins[0].initialized).toBe(true);
  });

  it('should convert html to markdown and post process', () => {
    const html = '<p>Hello</p>';
    markdownManager.loadPlugins('')
    const markdown = markdownManager.convertHtmlToMarkdown(html);
    expect(markdown).toBe('Hello processed');
  });

  it('should add yaml frontmatter metadata to markdown', async () => {
    const markdown = 'content';
    const metaData = {
      title: 'Test Title',
      tags: ['tag1', 'tag2']
    };
    const result = await markdownManager.addMetaDataToMarkdown(markdown, metaData);
    expect(result).toContain('---');
    expect(result).toContain('title: Test Title');
    expect(result).toContain('tags:');
    expect(result).toContain('  - "tag1"');
    expect(result).toContain('  - "tag2"');
    expect(result).toContain('content');
  });

  it('should create correct yaml frontmatter string', () => {
    const metaData = {
      key1: 'value1',
      key2: ['val1', 'val2']
    };
    const yaml = (markdownManager as any).createYamlFrontmatter(metaData);
    expect(yaml).toContain('key1: value1');
    expect(yaml).toContain('key2:');
    expect(yaml).toContain('  - "val1"');
    expect(yaml).toContain('  - "val2"');
  });

  it('should handle empty metadata in createYamlFrontmatter', () => {
    const metaData = {};
    const yaml = (markdownManager as any).createYamlFrontmatter(metaData);
    expect(yaml).toBe('---\n---\n');
  });

  it('should handle empty string and array values in metadata', async () => {
    const markdown = 'content';
    const metaData = {
      emptyString: '',
      emptyArray: []
    };
    const result = await markdownManager.addMetaDataToMarkdown(markdown, metaData);
    expect(result).toContain('emptyString: ');
    expect(result).toContain('emptyArray:');
    expect(result).toContain('content');
  });

  it('should process multiple plugins in convertHtmlToMarkdown', async () => {
    // Create a manager with multiple dummy plugins
    class MultiPlugin extends TestMarkdownManager {
      protected getPluginModules(): any[] {
        return [
          new DummyPlugin(),
          {
            initialized: false,
            initialize(turndownService: any) { this.initialized = true; },
            postProcess(markdown: string) { return markdown + ' multi'; }
          }
        ];
      }
    }
    const multiManager = new MultiPlugin();
    await multiManager.loadPlugins('');
    const result = multiManager.convertHtmlToMarkdown('<p>Test</p>');
    expect(result).toBe('Test processed multi');
  });

  it('should initialize all plugins on loadPlugins', async () => {
    const plugins = (markdownManager as any).getPluginModules();
    for (const plugin of plugins) {
      plugin.initialized = false;
      plugin.initialize = function() { this.initialized = true; };
    }
    await markdownManager.loadPlugins('');
    const loadedPlugins = (markdownManager as any).plugins;
    for (const plugin of loadedPlugins) {
      expect(plugin.initialized).toBe(true);
    }
  });

});
