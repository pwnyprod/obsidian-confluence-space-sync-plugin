import { describe, it, expect } from 'vitest';
import TurndownService from 'turndown';
import { TaskListPlugin } from '../../src/plugins/TaskListPlugin';

describe('TaskListPlugin', () => {
  it('should add task-list rules on initialize', () => {
    const turndownService = new TurndownService();
    const plugin = new TaskListPlugin();
    plugin.initialize(turndownService);

    const ruleTask = turndownService.rules.array.find(r => typeof r.filter === 'function' && r.filter({ nodeName: 'AC:TASK' } as HTMLElement, {}));
    expect(ruleTask).toBeDefined();

    const ruleObsolet = turndownService.rules.array.find(r => typeof r.filter === 'function' && ['AC:TASK-ID', 'AC:TASK-UUID', 'AC:TASK-STATUS'].some(name => typeof r.filter === 'function' && r.filter({ nodeName: name } as HTMLElement, {})));
    expect(ruleObsolet).toBeDefined();

    const ruleClear = turndownService.rules.array.find(r => typeof r.filter === 'function' && ['AC:TASK-LIST', 'AC:TASK-BODY'].some(name => typeof r.filter === 'function' && r.filter({ nodeName: name } as HTMLElement, {})));
    expect(ruleClear).toBeDefined();
  });

  it('postProcess should trim markdown', () => {
    const plugin = new TaskListPlugin();
    const input = '  - [ ] task  ';
    expect(plugin.postProcess(input)).toBe(input.trim());
  });
});