import { describe, it, expect } from 'vitest';
import TurndownService from 'turndown';
import { ParagraphPlugin } from '../../src/plugins/paragraphPlugin';

describe('ParagraphPlugin', () => {
  it('should add paragraph rule on initialize', () => {
    const turndownService = new TurndownService();
    const plugin = new ParagraphPlugin();
    plugin.initialize(turndownService);

    const rule = turndownService.rules.array.find(r => r.filter === 'p');
    expect(rule).toBeDefined();
  });

  it('postProcess should return markdown unchanged', () => {
    const plugin = new ParagraphPlugin();
    const input = '\n\nparagraph\n\n';
    expect(plugin.postProcess(input)).toBe(input);
  });
});
