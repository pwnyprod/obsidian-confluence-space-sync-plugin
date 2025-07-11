import { describe, it, expect } from 'vitest';
import TurndownService from 'turndown';
import { SpanPlugin } from '../../src/plugins/spanPlugin';

describe('SpanPlugin', () => {
  it('should add span rule on initialize', () => {
    const turndownService = new TurndownService();
    const plugin = new SpanPlugin();
    plugin.initialize(turndownService);

    const rule = turndownService.rules.array.find(r => r.filter === 'span');
    expect(rule).toBeDefined();
  });

  it('postProcess should return markdown unchanged', () => {
    const plugin = new SpanPlugin();
    const input = 'span content';
    expect(plugin.postProcess(input)).toBe(input);
  });
});
