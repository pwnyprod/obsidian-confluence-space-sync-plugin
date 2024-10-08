import { requestUrl } from "obsidian";
import { ConfluenceSpaceResponse, ConfluenceSpacesListPageResponse, ConfluencePageResponse, ConfluenceChildPagesResponse } from "../definition/confluenceTypes";

export class ConfluenceAPIClient {
  private baseURL: string;
  private apiToken: string;
  private username: string;

  constructor(baseURL: string, apiToken: string, username: string) {
    this.baseURL = `${baseURL}/rest/api/`;
    this.apiToken = apiToken;
    this.username = username;
  }

  private getAuthHeaders(): Record<string, string> {
    return {
      "Authorization": `Basic ${Buffer.from(`${this.username}:${this.apiToken}`).toString('base64')}`,
      "Accept": "application/json"
    };
  }

  async fetchSpaces(type?: string): Promise<ConfluenceSpaceResponse> {
    let url = `${this.baseURL}space?limit=9999`;
    if (type !== undefined) {
      url += `&type=${type}`
    }
    
    const response = await requestUrl({
      url,
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch Confluence spaces: ${response.text}`);
    }

    return response.json as ConfluenceSpaceResponse;
  }

  async fetchPagesInSpace(spaceKey: string): Promise<ConfluenceSpacesListPageResponse> {
    const url = `${this.baseURL}space/${spaceKey}/content?limit=9999&expand=metadata,version,metadata.simple,metadata.labels,version.collaborators,version.collaborators.users`;
    const response = await requestUrl({
      url,
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch Confluence pages: ${response.text}`);
    }
    return response.json as ConfluenceSpacesListPageResponse;
  }

  async fetchPageContent(pageID: string): Promise<ConfluencePageResponse> {
    const url = `${this.baseURL}content/${pageID}?expand=body.storage`;
    const response = await requestUrl({
      url,
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch page ${pageID}: ${response.text}`);
    }
    return response.json as ConfluencePageResponse;
  }

  async fetchChildPages(pageID: string): Promise<ConfluenceChildPagesResponse> {
    const url = `${this.baseURL}content/${pageID}/child/page?limit=9999`;
    const response = await requestUrl({
      url,
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch page ${pageID}: ${response.text}`);
    }

    return response.json as ConfluenceChildPagesResponse;
  }
}
