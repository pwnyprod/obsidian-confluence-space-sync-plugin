import { describe, it, expect } from 'vitest';
import TurndownService from 'turndown';
import { TablePlugin } from '../../src/plugins/tablePlugin';

describe('TablePlugin', () => {
  it('should add table rules on initialize', () => {
    const turndownService = new TurndownService();
    const plugin = new TablePlugin();
    plugin.initialize(turndownService);

    const ruleTable = turndownService.rules.array.find(r => r.filter === 'table');
    expect(ruleTable).toBeDefined();

    const ruleRow = turndownService.rules.array.find(r => r.filter === 'tr');
    expect(ruleRow).toBeDefined();

    const ruleHeader = turndownService.rules.array.find(r => r.filter === 'th');
    expect(ruleHeader).toBeDefined();

    const ruleData = turndownService.rules.array.find(r => r.filter === 'td');
    expect(ruleData).toBeDefined();
  });

  it('postProcess should return markdown unchanged', () => {
    const plugin = new TablePlugin();
    const input = '| header | header |\n| --- | --- |\n| cell | cell |\n';
    expect(plugin.postProcess(input)).toBe(input);
  });
});
