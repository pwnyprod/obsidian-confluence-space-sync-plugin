import { describe, it, expect } from 'vitest';
import TurndownService from 'turndown';
import { CalloutPlugin } from '../../src/plugins/calloutPlugin';

describe('CalloutPlugin', () => {
  it('should add callout rules on initialize', () => {
    const turndownService = new TurndownService();
    const plugin = new CalloutPlugin();
    plugin.initialize(turndownService);

    const rulePanelType = turndownService.rules.array.find(r => typeof r.filter === 'function' && r.replacement && r.replacement.toString().includes('replacementCalloutBody'));
    expect(rulePanelType).toBeDefined();
  });

  it('postProcess should return markdown unchanged', () => {
    const plugin = new CalloutPlugin();
    const input = '> [!info] **Info panel:**\n> content';
    expect(plugin.postProcess(input)).toBe(input);
  });
});
