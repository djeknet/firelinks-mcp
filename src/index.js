import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import LaravelAPIClient from './lib/laravel-api.js';
import MCPHandler from './lib/mcp-handler.js';
import { linksTools } from './tools/links.js';
import { statisticsTools } from './tools/statistics.js';
import { domainsTools } from './tools/domains.js';
import { serversTools } from './tools/servers.js';

const app = express();
const PORT = process.env.PORT || 3000;
const LARAVEL_API_URL = process.env.LARAVEL_API_URL || 'http://localhost/api';

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'firelinks-mcp-server',
    version: '1.0.0',
  });
});

// MCP endpoint - main endpoint for JSON-RPC requests
app.post('/mcp', async (req, res) => {
  try {
    const { method, params, id, jsonrpc } = req.body;

    // Get API token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        jsonrpc: '2.0',
        error: {
          code: -32001,
          message: 'Missing or invalid Authorization header. Use: Authorization: Bearer YOUR_API_TOKEN',
        },
        id: id || null,
      });
    }

    const apiToken = authHeader.substring(7); // Remove "Bearer "

    // Create API client with token
    const apiClient = new LaravelAPIClient(LARAVEL_API_URL, apiToken);

    // Combine all tools
    const allTools = [
      ...linksTools,
      ...statisticsTools,
      ...domainsTools,
      ...serversTools,
    ];

    // Handle request based on method
    if (method === 'initialize') {
      return res.json({
        jsonrpc: '2.0',
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: 'firelinks-mcp-server',
            version: '1.0.0',
          },
        },
        id,
      });
    }

    if (method === 'tools/list') {
      const toolsList = allTools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      }));

      return res.json({
        jsonrpc: '2.0',
        result: {
          tools: toolsList,
        },
        id,
      });
    }

    if (method === 'tools/call') {
      const { name, arguments: args } = params;

      // Find tool
      const tool = allTools.find(t => t.name === name);

      if (!tool) {
        return res.json({
          jsonrpc: '2.0',
          error: {
            code: -32602,
            message: `Tool '${name}' not found`,
          },
          id,
        });
      }

      try {
        // Execute the tool
        const result = await tool.execute(apiClient, args);

        return res.json({
          jsonrpc: '2.0',
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          },
          id,
        });
      } catch (error) {
        return res.json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: `Error executing tool '${name}': ${error.message}`,
          },
          id,
        });
      }
    }

    // Unknown method
    return res.json({
      jsonrpc: '2.0',
      error: {
        code: -32601,
        message: `Method '${method}' not found`,
      },
      id,
    });

  } catch (error) {
    console.error('Error processing MCP request:', error);
    res.status(500).json({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal server error',
        data: error.message,
      },
      id: req.body.id || null,
    });
  }
});

// SSE endpoint for streaming (for future use)
app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial message
  res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`);

  // Keepalive every 30 seconds
  const keepalive = setInterval(() => {
    res.write(`:keepalive\n\n`);
  }, 30000);

  // Cleanup on client disconnect
  req.on('close', () => {
    clearInterval(keepalive);
    res.end();
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Firelinks MCP Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`SSE endpoint: http://localhost:${PORT}/sse`);
  console.log(`Laravel API URL: ${LARAVEL_API_URL}`);
});

