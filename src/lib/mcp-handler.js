import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

/**
 * MCP Server Handler
 * Handles requests for the Model Context Protocol
 */
class MCPHandler {
  constructor(tools, apiClient) {
    this.tools = tools;
    this.apiClient = apiClient;
    this.server = new Server(
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

    this.setupHandlers();
  }

  /**
   * Setup MCP protocol handlers
   */
  setupHandlers() {
    // Handler for getting the list of tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const toolsList = this.tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      }));

      return {
        tools: toolsList,
      };
    });

    // Handler for calling a tool
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      // Find tool by name
      const tool = this.tools.find(t => t.name === name);

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
        const result = await tool.execute(this.apiClient, args);

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
  }

  /**
   * Run MCP server with stdio transport
   */
  async runStdio() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Firelinks MCP Server running on stdio');
  }

  /**
   * Get server instance for use with HTTP transport
   */
  getServer() {
    return this.server;
  }
}

export default MCPHandler;

