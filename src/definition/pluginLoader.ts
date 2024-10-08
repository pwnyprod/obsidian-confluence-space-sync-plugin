import TurndownService from "turndown";

export interface Plugin {
  initialize(turndownService: TurndownService): void;
  postProcess(markdown: string): string;
}
