import { describe, it, expect } from 'vitest';
import TurndownService from 'turndown';
import { UnorderedListPlugin } from '../../src/plugins/unorderedListPlugin';

describe('UnorderedListPlugin', () => {
  it('should add unordered-list rule on initialize', () => {
    const turndownService = new TurndownService();
    const plugin = new UnorderedListPlugin();
    plugin.initialize(turndownService);

    const rule = turndownService.rules.array.find(r => r.filter === 'ul');
    expect(rule).toBeDefined();
  });

  it('postProcess should return markdown unchanged', () => {
    const plugin = new UnorderedListPlugin();
    const input = '- item';
    expect(plugin.postProcess(input)).toBe(input);
  });
});
