export interface ConfluenceSpace {
  id: number;
  key: string;
  name: string;
  type: string;
  status: string;
  _expandable: {
    settings: string;
    metadata: string;
    operations: string;
    lookAndFeel: string;
    identifiers: string;
    permissions: string;
    roles: string;
    icon: string;
    description: string;
    theme: string;
    history: string;
    homepage: string;
  };
  _links: {
    webui: string;
    self: string;
  };
}

export interface ConfluenceSpaceResponse {
  results: ConfluenceSpace[];
  start: number;
  limit: number;
  size: number;
  _links: {
    base: string;
    context: string;
    next?: string;
    self: string;
  };
}

export interface ConfluenceSpacesListPage {
  id: string;
  type: string;
  status: string;
  title: string;
  version?: {
    by: {
      type: string;
      accountId: string;
      accountType: string;
      email: string;
      publicName: string;
      displayName: string;
      isGuest: boolean;
    };
    when: string;
    friendlyWhen: string;
    collaborators?: {
      users?: Array<string>;
      userAccountIds: Array<string>
    };

  }
  macroRenderedOutput: Record<string, unknown>;
  metadata?: {
    labels?: {
      results: Array<{
        id: string;
        label: string;
        name: string;
        prefix: string;
      }>;
      start: number;
      limit: number;
      size: number;
    }
  }
  body?: {
    storage: {
      value: string;
      representation: string;
      embeddedContent: any[];
      _expandable: {
        content: string;
      };
    };
    _expandable: {
      editor: string;
      atlas_doc_format: string;
      view: string;
      export_view: string;
      styled_view: string;
      dynamic: string;
      editor2: string;
      anonymous_export_view: string;
    };
  };
  extensions: {
    position: number;
  };
  _expandable: {
    container: string;
    metadata: string;
    restrictions: string;
    history: string;
    version: string;
    descendants: string;
    space: string;
    childTypes: string;
    schedulePublishInfo: string;
    operations: string;
    schedulePublishDate: string;
    children: string;
    ancestors: string;
  };
  _links: {
    self: string;
    tinyui: string;
    editui: string;
    webui: string;
  };
}

export interface ConfluenceSpacesListPageResponse {
  page: {
    results: ConfluenceSpacesListPage[];
    start: number;
    limit: number;
    size: number;
  };
  blogpost: {
    esults: ConfluenceSpacesListPage[];
    start: number;
    limit: number;
    size: number;
  },
  _links: {
    base: string;
    context: string;
    next?: string;
    self: string;
  };
}

export interface ConfluencePageResponse {
  id: string;
  type: string;
  status: string;
  title: string;
  macroRenderedOutput: Record<string, unknown>;
  body?: {
    storage: {
      value: string;
      representation: string;
      embeddedContent: any[];
      _expandable: {
        content: string;
      };
    };
    _expandable: {
      editor: string;
      atlas_doc_format: string;
      view: string;
      export_view: string;
      styled_view: string;
      dynamic: string;
      editor2: string;
      anonymous_export_view: string;
    };
  };
  extensions: {
    position: number;
  };
  _expandable: {
    container: string;
    metadata: string;
    restrictions: string;
    history: string;
    version: string;
    descendants: string;
    space: string;
    childTypes: string;
    schedulePublishInfo: string;
    operations: string;
    schedulePublishDate: string;
    children: string;
    ancestors: string;
  };
  _links: {
    editui: string;
    webui: string;
    context: string;
    self: string;
    tinyui: string;
    collection: string;
    base: string;
  };
}

export interface ConfluenceChildPage {
  id: string;
  type: string;
  status: string;
  title: string;
  macroRenderedOutput: Record<string, unknown>;
  extensions: {
    position: number;
  };
  _expandable: {
    container: string;
    metadata: string;
    restrictions: string;
    history: string;
    body: string;
    version: string;
    descendants: string;
    space: string;
    childTypes: string;
    schedulePublishInfo: string;
    operations: string;
    schedulePublishDate: string;
    children: string;
    ancestors: string;
  };
  _links: {
    self: string;
    tinyui: string;
    editui: string;
    webui: string;
  };
}

export interface ConfluenceChildPagesResponse {
  results: ConfluenceChildPage[];
  start: number;
  limit: number;
  size: number;
  _links: {
    base: string;
    context: string;
    self: string;
  };
}

export type PageType = ConfluenceSpacesListPage | ConfluenceChildPage;