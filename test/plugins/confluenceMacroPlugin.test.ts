import { describe, it, expect } from 'vitest';
import TurndownService from 'turndown';
import { ConfluenceMacroPlugin } from '../../src/plugins/confluenceMacro';

describe('ConfluenceMacroPlugin', () => {
  it('should add confluence-macro rule on initialize', () => {
    const turndownService = new TurndownService();
    const plugin = new ConfluenceMacroPlugin();
    plugin.initialize(turndownService);

    const rule = turndownService.rules.array.find(r => Array.isArray(r.filter) && r.filter.includes('ac:structured-macro'));
    expect(rule).toBeDefined();
  });

  it('postProcess should return markdown unchanged', () => {
    const plugin = new ConfluenceMacroPlugin();
    const input = '**Confluence macro: example**\n\ncontent';
    expect(plugin.postProcess(input)).toBe(input);
  });
});
