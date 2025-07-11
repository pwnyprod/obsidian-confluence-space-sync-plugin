import { describe, it, expect } from 'vitest';
import TurndownService from 'turndown';
import { TimePlugin } from '../../src/plugins/timePlugin';

describe('TimePlugin', () => {
  it('should add time rule on initialize', () => {
    const turndownService = new TurndownService();
    const plugin = new TimePlugin();
    plugin.initialize(turndownService);

    const rule = turndownService.rules.array.find(r => r.filter === 'time');
    expect(rule).toBeDefined();
  });

  it('postProcess should return markdown unchanged', () => {
    const plugin = new TimePlugin();
    const input = '<time datetime="2025-07-11">July 11, 2025</time>';
    expect(plugin.postProcess(input)).toBe(input);
  });
});
