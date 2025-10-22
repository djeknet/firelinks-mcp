/**
 * Tools for managing domains
 */

export const domainsTools = [
  {
    name: 'firelinks_list_domains',
    description: 'Get a list of all user domains with filtering capabilities. Domains are used to create branded short links.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Domain ID (optional)',
        },
        domain: {
          type: 'string',
          description: 'Domain name (optional)',
        },
        is_default: {
          type: 'number',
          enum: [0, 1],
          description: 'Get the default domain: 0 - not default, 1 - default (optional)',
        },
        my: {
          type: 'number',
          enum: [0, 1],
          description: 'Only my domains: 1 - only my domains, 0 - all domains (optional)',
        },
        status: {
          type: 'number',
          enum: [0, 1],
          description: 'Domain Activity: 1 - On, 0 - Off (optional)',
        },
        server_ip: {
          type: 'string',
          description: 'IP of the server to which the domain is linked (optional)',
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
        server_ip: {
          type: 'string',
          description: 'IP of the server to link the domain to - required field',
        },
        default_url: {
          type: 'string',
          description: 'Default URL, for redirects without code (optional)',
        },
        end_date: {
          type: 'string',
          description: 'Domain end date in Y-m-d format (e.g., 2025-12-31) (optional)',
        },
        is_default: {
          type: 'number',
          enum: [0, 1],
          description: '1 - Make the default domain for links, 0 - not default (optional)',
        },
        ssl_code: {
          type: 'number',
          enum: [0, 1],
          description: '1 - Generate SSL Lets Encrypt, 0 - do not generate (optional)',
        },
      },
      required: ['domain', 'server_ip'],
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

