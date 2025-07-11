import { describe, it, expect } from 'vitest';
import TurndownService from 'turndown';
import { AnchorPlugin } from '../../src/plugins/anchorPlugin';

describe('AnchorPlugin', () => {
  it('should add anchor rule on initialize', () => {
    const turndownService = new TurndownService();
    const plugin = new AnchorPlugin();
    plugin.initialize(turndownService);

    const rule = turndownService.rules.array.find(r => r.filter === 'a');
    expect(rule).toBeDefined();
  });

  it('postProcess should return markdown unchanged', () => {
    const plugin = new AnchorPlugin();
    const input = '[Link](http://example.com)';
    expect(plugin.postProcess(input)).toBe(input);
  });
});
