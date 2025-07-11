import { describe, it, expect } from 'vitest';
import TurndownService from 'turndown';
import { ReportUnknownTagsPlugin } from '../../src/plugins/reportUnknownTags';

describe('ReportUnknownTagsPlugin', () => {
  it('should add report-unknown-tags rule on initialize', () => {
    const turndownService = new TurndownService();
    const plugin = new ReportUnknownTagsPlugin();
    plugin.initialize(turndownService);

    const rule = turndownService.rules.array.find(r => typeof r.filter === 'function' && r.replacement && r.replacement.toString().includes('tagName'));
    expect(rule).toBeDefined();
  });

  it('postProcess should return markdown unchanged', () => {
    const plugin = new ReportUnknownTagsPlugin();
    const input = 'unknown tag content';
    expect(plugin.postProcess(input)).toBe(input);
  });
});
