/**
 * Tools for managing links
 */

export const linksTools = [
  {
    name: 'firelinks_create_link',
    description: 'Create a new short link in the Firelinks system. Allows shortening a long URL and getting a short link with additional parameters.',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'URL to shorten (required field)',
        },
        alias: {
          type: 'string',
          description: 'Custom alias for the short link (optional)',
        },
        domain_id: {
          type: 'number',
          description: 'Domain ID to use (optional)',
        },
        description: {
          type: 'string',
          description: 'Link description (optional)',
        },
        password: {
          type: 'string',
          description: 'Password to protect the link (optional)',
        },
        expired_at: {
          type: 'string',
          description: 'Link expiration date in YYYY-MM-DD format (optional)',
        },
      },
      required: ['url'],
    },
    async execute(apiClient, args) {
      const response = await apiClient.get('/out/links/create', args);
      
      if (!response.success) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
  },

  {
    name: 'firelinks_get_link',
    description: 'Get information about a specific link by its ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Link ID (required field)',
        },
      },
      required: ['id'],
    },
    async execute(apiClient, args) {
      const response = await apiClient.get('/out/link/get', args);
      
      if (!response.success) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
  },

  {
    name: 'firelinks_list_links',
    description: 'Get a list of all user links with filtering and pagination capabilities.',
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'number',
          description: 'Page number for pagination (default 1)',
        },
        per_page: {
          type: 'number',
          description: 'Number of links per page (default 20)',
        },
        search: {
          type: 'string',
          description: 'Search query to filter links',
        },
        sort: {
          type: 'string',
          description: 'Field to sort by (created_at, clicks, url)',
        },
        order: {
          type: 'string',
          enum: ['asc', 'desc'],
          description: 'Sort direction (asc or desc)',
        },
      },
      required: [],
    },
    async execute(apiClient, args) {
      const response = await apiClient.get('/out/links/list', args);
      
      if (!response.success) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
  },

  {
    name: 'firelinks_update_link_url',
    description: 'Update the target URL of an existing short link.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Link ID to update (required field)',
        },
        url: {
          type: 'string',
          description: 'New target URL (required field)',
        },
      },
      required: ['id', 'url'],
    },
    async execute(apiClient, args) {
      const response = await apiClient.get('/out/link/url', args);
      
      if (!response.success) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
  },

  {
    name: 'firelinks_add_reserve_url',
    description: 'Add a reserve URL to an existing link. The reserve URL will be used if the main URL is unavailable.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Link ID (required field)',
        },
        url: {
          type: 'string',
          description: 'Reserve URL (required field)',
        },
      },
      required: ['id', 'url'],
    },
    async execute(apiClient, args) {
      const response = await apiClient.get('/out/link/add/reserve', args);
      
      if (!response.success) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
  },
];

