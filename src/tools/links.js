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
          description: 'Valid link with http or https (required field)',
        },
        type: {
          type: 'string',
          description: 'The type of link. Possible options: url - Web link (required field)',
          default: 'url',
        },
        redirect_type: {
          type: 'number',
          description: 'Redirect type: 0 - 301 Moved Permanently, 1 - 302 Found, 2 - 303 See Other, 4 - META Refresh (required field)',
          default: 0,
        },
        link_name: {
          type: 'string',
          description: 'Link name (optional)',
        },
        keywords: {
          type: 'string',
          description: 'Keywords for link search (optional)',
        },
        keywords_mode: {
          type: 'number',
          description: 'Keyword search logic: 1 - any word, 2 - half of the words, 3 - all the words from the query must be taken into account (optional)',
        },
        domain_id: {
          type: 'number',
          description: 'The ID of your domain, which can be obtained from the Domains page (optional)',
        },
        sub_domain: {
          type: 'string',
          description: 'You can create a subdomain, or specify an existing one. Only latin characters and numbers (optional)',
        },
        code: {
          type: 'string',
          description: 'The link code. Must be unique. The Latin alphabet, numbers and underscores are allowed (optional)',
        },
        group_id: {
          type: 'number',
          description: 'Link group ID (optional)',
        },
        options: {
          type: 'string',
          description: 'A string with a list of additional settings (optional)',
        },
      },
      required: ['url', 'type', 'redirect_type'],
    },
    async execute(apiClient, args) {
      // Set default values if not provided
      if (!args.type) {
        args.type = 'url';
      }
      if (args.redirect_type === undefined) {
        args.redirect_type = 0;
      }
      
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
      
      return response;
    },
  },

  {
    name: 'firelinks_list_links',
    description: 'Get a list of all user links with filtering and pagination capabilities. Supports filtering by code, date range, URL, clicks, title, link name, and status.',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'Link code (optional)',
        },
        date_from: {
          type: 'string',
          description: 'Date the link was added from in Y-m-d format (e.g., 2024-01-01) (optional)',
        },
        date_to: {
          type: 'string',
          description: 'Date the link was added before in Y-m-d format (e.g., 2024-12-31) (optional)',
        },
        link_id: {
          type: 'number',
          description: 'Link ID (optional)',
        },
        url: {
          type: 'string',
          description: 'Search by site link (optional)',
        },
        clicks: {
          type: 'number',
          description: 'Click-throughs number for filtering (optional)',
        },
        clicks_type: {
          type: 'number',
          description: 'The direction of the search by clicks: 1 - greater than or equal to, 2 - less than or equal to (optional)',
        },
        title: {
          type: 'string',
          description: 'Search by page title (optional)',
        },
        link_name: {
          type: 'string',
          description: 'Search by link name (optional)',
        },
        status: {
          type: 'number',
          enum: [1, 3, 4],
          description: 'The status of links: 1 - Active, 3 - Pause, 4 - Blocked (optional)',
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

