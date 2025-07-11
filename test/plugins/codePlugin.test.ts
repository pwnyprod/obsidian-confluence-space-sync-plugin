import { describe, it, expect } from 'vitest';
import TurndownService from 'turndown';
import { CodePlugin } from '../../src/plugins/codePlugin';

describe('CodePlugin', () => {
  it('should add inline-code rule on initialize', () => {
    const turndownService = new TurndownService();
    const plugin = new CodePlugin();
    plugin.initialize(turndownService);

    const rule = turndownService.rules.array.find(r => r.filter === 'code');
    expect(rule).toBeDefined();
  });

  it('postProcess should return markdown unchanged', () => {
    const plugin = new CodePlugin();
    const input = `\`\`\`
code block
\`\`\``;
    expect(plugin.postProcess(input)).toBe(input);
  });
});
