export interface SpaceConfig {
  spaceKey: string;
  targetFolderPath: string;
}

export interface ConfluenceSyncSettings {
  confluenceBaseURL: string;
  apiToken: string;
  username: string;
  syncInterval: number;
  type: string;
  spaces: SpaceConfig[];
  start: boolean;
}

export const DEFAULT_SETTINGS: ConfluenceSyncSettings = {
  confluenceBaseURL: "https://your-confluence-domain.atlassian.net/wiki",
  apiToken: "",
  username: "",
  syncInterval: 15,
  type: 'undefined',
  spaces: [],
  start: false
};
