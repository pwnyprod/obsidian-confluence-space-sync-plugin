import { describe, it, expect } from 'vitest';
import TurndownService from 'turndown';
import { HeadingPlugin } from '../../src/plugins/headingPlugin';

describe('HeadingPlugin', () => {
  it('should add custom-heading rule on initialize', () => {
    const turndownService = new TurndownService();
    const plugin = new HeadingPlugin();
    plugin.initialize(turndownService);

    const rule = turndownService.rules.array.find(r => typeof r.filter === 'function' && r.replacement && r.replacement.toString().includes('customMarkdownHeading'));
    expect(rule).toBeDefined();
  });

  it('postProcess should return markdown unchanged', () => {
    const plugin = new HeadingPlugin();
    const input = '# Heading\n\n';
    expect(plugin.postProcess(input)).toBe(input);
  });
});
