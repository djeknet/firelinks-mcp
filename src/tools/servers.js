/**
 * Tools for working with servers
 */

export const serversTools = [
  {
    name: 'firelinks_list_servers',
    description: 'Get a list of all available servers in the Firelinks system. Servers are used to host domains and handle redirects.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
    async execute(apiClient, args) {
      const response = await apiClient.get('/out/servers', args);
      
      if (!response.success) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
  },
];

