/**
 * Tools for getting statistics
 */

export const statisticsTools = [
  {
    name: 'firelinks_stat_days',
    description: 'Get click statistics by day for the specified period. Returns the number of clicks for each day.',
    inputSchema: {
      type: 'object',
      properties: {
        date_from: {
          type: 'string',
          description: 'Period start date in YYYY-MM-DD format (required field)',
        },
        date_to: {
          type: 'string',
          description: 'Period end date in YYYY-MM-DD format (required field)',
        },
        link_id: {
          type: 'number',
          description: 'Specific link ID for filtering (optional)',
        },
        domain_id: {
          type: 'number',
          description: 'Domain ID for filtering (optional)',
        },
      },
      required: ['date_from', 'date_to'],
    },
    async execute(apiClient, args) {
      const response = await apiClient.get('/out/stat/days', args);
      
      if (!response.success) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
  },

  {
    name: 'firelinks_stat_total',
    description: 'Get total aggregate statistics for the period. Includes total clicks, unique visitors, and other metrics.',
    inputSchema: {
      type: 'object',
      properties: {
        date_from: {
          type: 'string',
          description: 'Period start date in YYYY-MM-DD format (required field)',
        },
        date_to: {
          type: 'string',
          description: 'Period end date in YYYY-MM-DD format (required field)',
        },
        link_id: {
          type: 'number',
          description: 'Specific link ID for filtering (optional)',
        },
      },
      required: ['date_from', 'date_to'],
    },
    async execute(apiClient, args) {
      const response = await apiClient.get('/out/stat/total', args);
      
      if (!response.success) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
  },

  {
    name: 'firelinks_stat_links',
    description: 'Get statistics for all user links for the period. Shows the number of clicks for each link.',
    inputSchema: {
      type: 'object',
      properties: {
        date_from: {
          type: 'string',
          description: 'Period start date in YYYY-MM-DD format (required field)',
        },
        date_to: {
          type: 'string',
          description: 'Period end date in YYYY-MM-DD format (required field)',
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default 1)',
        },
        per_page: {
          type: 'number',
          description: 'Number of records per page (default 20)',
        },
      },
      required: ['date_from', 'date_to'],
    },
    async execute(apiClient, args) {
      const response = await apiClient.get('/out/stat/links', args);
      
      if (!response.success) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
  },

  {
    name: 'firelinks_stat_clicks',
    description: 'Get detailed click statistics broken down by various parameters: countries, devices, browsers, operating systems, etc.',
    inputSchema: {
      type: 'object',
      properties: {
        date_from: {
          type: 'string',
          description: 'Period start date in YYYY-MM-DD format (required field)',
        },
        date_to: {
          type: 'string',
          description: 'Period end date in YYYY-MM-DD format (required field)',
        },
        link_id: {
          type: 'number',
          description: 'Specific link ID for filtering (optional)',
        },
        group_by: {
          type: 'string',
          enum: ['country', 'device', 'browser', 'os', 'referer'],
          description: 'Group statistics by parameter',
        },
        page: {
          type: 'number',
          description: 'Page number for pagination',
        },
      },
      required: ['date_from', 'date_to'],
    },
    async execute(apiClient, args) {
      const response = await apiClient.get('/out/stat/clicks', args);
      
      if (!response.success) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
  },

  {
    name: 'firelinks_stat_compare',
    description: 'Compare statistics between two periods. Useful for analyzing traffic changes.',
    inputSchema: {
      type: 'object',
      properties: {
        period1_from: {
          type: 'string',
          description: 'Start date of the first period in YYYY-MM-DD format (required field)',
        },
        period1_to: {
          type: 'string',
          description: 'End date of the first period in YYYY-MM-DD format (required field)',
        },
        period2_from: {
          type: 'string',
          description: 'Start date of the second period in YYYY-MM-DD format (required field)',
        },
        period2_to: {
          type: 'string',
          description: 'End date of the second period in YYYY-MM-DD format (required field)',
        },
        link_id: {
          type: 'number',
          description: 'Specific link ID for filtering (optional)',
        },
      },
      required: ['period1_from', 'period1_to', 'period2_from', 'period2_to'],
    },
    async execute(apiClient, args) {
      const response = await apiClient.get('/out/stat/compare', args);
      
      if (!response.success) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
  },
];

