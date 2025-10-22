#!/usr/bin/env node

import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import LaravelAPIClient from './lib/laravel-api.js';
import { linksTools } from './tools/links.js';
import { statisticsTools } from './tools/statistics.js';
import { domainsTools } from './tools/domains.js';
import { serversTools } from './tools/servers.js';

const LARAVEL_API_URL = process.env.LARAVEL_API_URL || 'https://firelinks.cc/api';
const API_TOKEN = process.env.FIRELINKS_API_TOKEN;

if (!API_TOKEN) {
  console.error('Error: FIRELINKS_API_TOKEN environment variable is required');
  console.error('Please create a .env file based on .env.example');
  process.exit(1);
}

// Create API client
const apiClient = new LaravelAPIClient(LARAVEL_API_URL, API_TOKEN);

// Combine all tools
const allTools = [
  ...linksTools,
  ...statisticsTools,
  ...domainsTools,
  ...serversTools,
];

// Create MCP server
const server = new Server(
  {
    name: 'firelinks-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handler for getting the list of tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const toolsList = allTools.map(tool => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
  }));

  return {
    tools: toolsList,
  };
});

// Handler for calling a tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // Find tool by name
  const tool = allTools.find(t => t.name === name);

  if (!tool) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: Tool '${name}' not found`,
        },
      ],
      isError: true,
    };
  }

  try {
    // Execute the tool
    const result = await tool.execute(apiClient, args);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error executing tool '${name}': ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Run server with stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Firelinks MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

