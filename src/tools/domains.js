/**
 * Tools for managing domains
 */

export const domainsTools = [
  {
    name: 'firelinks_list_domains',
    description: 'Get a list of all user domains. Domains are used to create branded short links.',
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'number',
          description: 'Page number for pagination (default 1)',
        },
        per_page: {
          type: 'number',
          description: 'Number of domains per page (default 20)',
        },
        status: {
          type: 'number',
          enum: [0, 1],
          description: 'Filter by status: 0 - inactive, 1 - active',
        },
      },
      required: [],
    },
    async execute(apiClient, args) {
      const response = await apiClient.get('/out/domains/list', args);
      
      if (!response.success) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
  },

  {
    name: 'firelinks_create_domain',
    description: 'Add a new domain to the system. The domain must be configured to point to the specified server. The system will verify the correctness of DNS settings.',
    inputSchema: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          description: 'Domain name (e.g., link.example.com) - required field',
        },
        server: {
          type: 'string',
          description: 'IP address of the server to which the domain should point - required field',
        },
        default: {
          type: 'number',
          enum: [0, 1],
          description: 'Make the domain default (1) or not (0)',
        },
        ssl_code: {
          type: 'string',
          description: 'SSL certificate (optional)',
        },
        default_url: {
          type: 'string',
          description: 'Default redirect URL (optional)',
        },
        end_date: {
          type: 'string',
          description: 'Domain expiration date in YYYY-MM-DD format (optional)',
        },
      },
      required: ['domain', 'server'],
    },
    async execute(apiClient, args) {
      const response = await apiClient.get('/out/domain/create', args);
      
      if (!response.success) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
  },
];

