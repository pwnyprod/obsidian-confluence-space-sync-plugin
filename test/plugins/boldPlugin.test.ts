import { describe, it, expect } from 'vitest';
import TurndownService from 'turndown';
import { BoldPlugin } from '../../src/plugins/boldPlugin';

describe('BoldPlugin', () => {
  it('should add bold rule on initialize', () => {
    const turndownService = new TurndownService();
    const plugin = new BoldPlugin();
    plugin.initialize(turndownService);

    const rule = turndownService.rules.array.find(r => r.filter === 'strong');
    expect(rule).toBeDefined();
  });

  it('postProcess should return markdown unchanged', () => {
    const plugin = new BoldPlugin();
    const input = '**bold**';
    expect(plugin.postProcess(input)).toBe(input);
  });
});
