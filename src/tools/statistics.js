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
        }
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
    description: 'Get statistics for user links for the period. Shows the number of clicks for each link. Can filter by specific link ID or array of link IDs.',
    inputSchema: {
      type: 'object',
      properties: {
        date_from: {
          type: 'string',
          description: 'Date from in Y-m-d format (e.g., 2024-01-01) (optional)',
        },
        date_to: {
          type: 'string',
          description: 'Date to in Y-m-d format (e.g., 2024-12-31) (optional)',
        },
        link_id: {
          type: 'number',
          description: 'Link ID (optional)',
        },
        links: {
          type: 'array',
          items: {
            type: 'number',
          },
          description: 'Array of link IDs (optional)',
        },
      },
      required: [],
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
    description: 'Get detailed click statistics with extensive filtering options: time range, links, IP, geo, device, browser, OS, referer, traffic quality, and more.',
    inputSchema: {
      type: 'object',
      properties: {
        time_from: {
          type: 'string',
          description: 'Time from in Y-m-d H:i:s format (e.g., 2024-01-01 00:00:00) (optional)',
        },
        time_to: {
          type: 'string',
          description: 'Time to in Y-m-d H:i:s format (e.g., 2024-12-31 23:59:59) (optional)',
        },
        date_from: {
          type: 'string',
          description: 'Date from in Y-m-d format (e.g., 2024-01-01) (optional)',
        },
        date_to: {
          type: 'string',
          description: 'Date to in Y-m-d format (e.g., 2024-12-31) (optional)',
        },
        dates: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of specific dates in Y-m-d format (optional)',
        },
        links: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of link IDs (optional)',
        },
        clicks_id: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of click IDs (optional)',
        },
        clicker_id: {
          type: 'number',
          description: 'Clicker ID (optional)',
        },
        unique_click: {
          type: 'number',
          enum: [0, 1],
          description: 'Unique clicks or not: 0 - all clicks, 1 - unique only (optional)',
        },
        click_out: {
          type: 'number',
          enum: [0, 1],
          description: 'The link redirect is confirmed or not: 0 - not confirmed, 1 - confirmed (optional)',
        },
        ad_click: {
          type: 'number',
          enum: [0, 1],
          description: 'Click on an ad: 0 - no, 1 - yes (optional)',
        },
        sub_id: {
          type: 'string',
          description: 'Sub ID, transmitted via the Traffic Analysis > Subid analysis option (optional)',
        },
        sub_id1: {
          type: 'string',
          description: 'Sub ID 1, transmitted via the Traffic Analysis > Subid analysis option (optional)',
        },
        sub_id2: {
          type: 'string',
          description: 'Sub ID 2, transmitted via the Traffic Analysis > Subid analysis option (optional)',
        },
        sub_id3: {
          type: 'string',
          description: 'Sub ID 3, transmitted via the Traffic Analysis > Subid analysis option (optional)',
        },
        out_url: {
          type: 'string',
          description: 'The link that the user go to. Partial Match Search (optional)',
        },
        link_clicks: {
          type: 'number',
          description: 'Total number of clicks on links (optional)',
        },
        ip_version: {
          type: 'number',
          enum: [4, 6],
          description: 'IP version: 4 or 6 (optional)',
        },
        ip: {
          type: 'string',
          description: 'Accurate IP filter (optional)',
        },
        ipv6: {
          type: 'string',
          description: 'Accurate IPV6 filter (optional)',
        },
        ip_network1: {
          type: 'string',
          description: 'Accurate filter by subnet 1 (optional)',
        },
        ip_network2: {
          type: 'string',
          description: 'Accurate filter by subnet 2 (optional)',
        },
        proxy: {
          type: 'string',
          description: 'Filter by proxy (optional)',
        },
        proxy_type: {
          type: 'string',
          enum: ['VPN', 'TOR', 'DCH', 'PUB', 'WEB', 'SES'],
          description: 'By proxy type: VPN, TOR, DCH, PUB, WEB, SES (optional)',
        },
        ua: {
          type: 'string',
          description: 'Filter by any part of the User Agent (optional)',
        },
        referer: {
          type: 'string',
          description: 'Full click source (optional)',
        },
        referer_domain: {
          type: 'string',
          description: 'Domain of a click source (optional)',
        },
        referer_name: {
          type: 'string',
          description: 'Name of a well-known click source (optional)',
        },
        cc: {
          type: 'string',
          description: 'Country ISO code (optional)',
        },
        country: {
          type: 'string',
          description: 'Country name (optional)',
        },
        region: {
          type: 'string',
          description: 'Region of a country (optional)',
        },
        city: {
          type: 'string',
          description: 'City (optional)',
        },
        device: {
          type: 'string',
          description: 'Device type (optional)',
        },
        brand: {
          type: 'string',
          description: 'Device Brand (optional)',
        },
        model: {
          type: 'string',
          description: 'Device Model (optional)',
        },
        os: {
          type: 'string',
          description: 'OS (optional)',
        },
        os_ver: {
          type: 'string',
          description: 'OS version (optional)',
        },
        browser: {
          type: 'string',
          description: 'Browser (optional)',
        },
        browser_ver: {
          type: 'string',
          description: 'Browser version (optional)',
        },
        browser_type: {
          type: 'string',
          description: 'Browser type (optional)',
        },
        lang: {
          type: 'string',
          description: 'The main language of the device (optional)',
        },
        lang_full: {
          type: 'string',
          description: 'Full device language (optional)',
        },
        is_bot: {
          type: 'number',
          enum: [0, 1],
          description: 'The click was made by a bot: 0 - no, 1 - yes (optional)',
        },
        quality: {
          type: 'number',
          enum: [0, 1, 2, 3],
          description: 'Traffic quality: 0 - undefined, 1 - good, 2 - suspect, 3 - bad (optional)',
        },
        isp: {
          type: 'string',
          description: 'Internet service provider (optional)',
        },
        load_file: {
          type: 'number',
          enum: [0, 1],
          description: 'Downloaded file or not: 0 - no, 1 - yes (optional)',
        },
        adblock: {
          type: 'number',
          enum: [0, 1],
          description: 'Ad blocker enabled: 0 - no, 1 - yes (optional)',
        },
        cl_lang: {
          type: 'string',
          description: 'Browser language (optional)',
        },
        cl_platform: {
          type: 'string',
          description: 'Client platform (optional)',
        },
        cl_timezone: {
          type: 'string',
          description: 'Client time zone (optional)',
        },
        cl_ua: {
          type: 'string',
          description: 'Client browser (optional)',
        },
        cl_color_depth: {
          type: 'number',
          description: 'Client device color depth (optional)',
        },
        cl_java_enabled: {
          type: 'number',
          enum: [0, 1],
          description: 'Client JAVA support: 0 - no, 1 - yes (optional)',
        },
        cl_cookie_enabled: {
          type: 'number',
          enum: [0, 1],
          description: 'Client cookies support: 0 - no, 1 - yes (optional)',
        },
        cl_pixel_depth: {
          type: 'number',
          description: 'Client the bit depth of the screen (optional)',
        },
        cl_screen_size: {
          type: 'string',
          description: 'Client screen sizes (optional)',
        },
        cl_window_size: {
          type: 'string',
          description: 'Client window sizes (optional)',
        },
        cl_screen_width: {
          type: 'number',
          description: 'Client screen width (optional)',
        },
        cl_screen_height: {
          type: 'number',
          description: 'Client screen height (optional)',
        },
        cl_window_width: {
          type: 'number',
          description: 'Client window width (optional)',
        },
        cl_window_height: {
          type: 'number',
          description: 'Client window height (optional)',
        },
        ip_from: {
          type: 'number',
          description: 'IP from. Converted via ip2long (optional)',
        },
        ip_to: {
          type: 'number',
          description: 'IP to. Converted via ip2long (optional)',
        },
        sort: {
          type: 'string',
          description: 'A field for sorting. By default - time (optional)',
        },
        order: {
          type: 'string',
          enum: ['asc', 'desc'],
          description: 'The direction of sorting: desc - descending, asc - ascending. By default - desc (optional)',
        },
        limit: {
          type: 'number',
          description: 'Number of records to output. By default - 100. From 1 to 10000 (optional)',
        },
      },
      required: [],
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
    description: 'Compare statistics between two periods grouped by various parameters. Useful for analyzing traffic changes by link, location, device, browser, and more.',
    inputSchema: {
      type: 'object',
      properties: {
        period1_from: {
          type: 'string',
          description: 'Period from in Y-m-d format (e.g., 2024-01-01) (required field)',
        },
        period1_to: {
          type: 'string',
          description: 'Period to in Y-m-d format (e.g., 2024-01-31) (required field)',
        },
        period2_from: {
          type: 'string',
          description: 'Comparative period from in Y-m-d format (e.g., 2024-02-01) (required field)',
        },
        period2_to: {
          type: 'string',
          description: 'Comparative period to in Y-m-d format (e.g., 2024-02-28) (required field)',
        },
        group: {
          type: 'string',
          description: 'By which field to group. Can be comma-separated (e.g., "os,os_ver"). Possible options: link_id, clicker_id, sub_id, sub_id1, sub_id2, sub_id3, ipv4, ipv6, ip_network1, ip_network2, proxy_type, ua, referer, referer_domain, referer_name, cc, country, region, city, device, brand, model, os, os_ver, browser, browser_ver, browser_type, lang, lang_full, is_bot, isp, adblock (required field)',
        },
        links: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of link IDs (optional)',
        },
        limit: {
          type: 'number',
          description: 'Number of records to output. By default - 100. From 1 to 10000 (optional)',
        },
      },
      required: ['period1_from', 'period1_to', 'period2_from', 'period2_to', 'group'],
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

