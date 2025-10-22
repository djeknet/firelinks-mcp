# Firelinks MCP Server

MCP (Model Context Protocol) server for the Firelinks platform, allowing external LLMs (Large Language Models) to interact with the Firelinks API - https://firelinks.cc/p/api

## Description

This server implements the MCP protocol developed by Anthropic and provides a set of tools for working with the Firelinks platform:

- **Link Management**: create, retrieve, edit short links
- **Statistics**: get detailed click statistics, compare periods
- **Domains**: manage custom domains
- **Servers**: get list of available servers

## Architecture

```
LLM client → HTTPS (mcp.firelinks.cc) → Node.js MCP Server → Firelinks API Backend
```

## Requirements

- Node.js >= 20.0.0
- Docker and Docker Compose (for containerization)
- Firelinks API token

## Installation

### Local Development

1. Install dependencies:
```bash
cd mcp-server
npm install
```

2. Create `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```env
PORT=3000
LARAVEL_API_URL=https://firelinks.cc/api
NODE_ENV=development
```

4. Start the server:
```bash
npm start
```

Or for development mode with auto-reload:
```bash
npm run dev
```

### Docker

1. Build the image:
```bash
docker build -t firelinks-mcp-server .
```

2. Run the container:
```bash
docker run -d \
  -p 3000:3000 \
  -e LARAVEL_API_URL=https://firelinks.cc/api \
  --name firelinks-mcp-server \
  firelinks-mcp-server
```

### Docker Compose

```bash
docker-compose up -d
```

## Usage

### Endpoints

- `GET /health` - server health check
- `POST /mcp` - main MCP endpoint (JSON-RPC 2.0)
- `GET /sse` - Server-Sent Events for streaming

### Authentication

All requests to `/mcp` require an authentication token in the header:

```
Authorization: Bearer YOUR_API_TOKEN
```

You can get an API token in your Firelinks account.

## Integration with LLM Clients

### Claude Desktop

Add to Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "firelinks": {
      "url": "https://mcp.firelinks.cc/mcp",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer YOUR_API_TOKEN"
      }
    }
  }
}
```

### Cursor 

Add to Cursor configuration (`mcp.json`):


```json
{
  "mcpServers": {
    "firelinks": {
      "url": "https://mcp.firelinks.cc/mcp",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer YOUR_API_TOKEN"
      }
    }
  }
}
```


### Other MCP Clients

For connecting to other MCP-compatible clients use:
- **URL**: `https://mcp.firelinks.cc/mcp`
- **Transport**: HTTP
- **Authentication**: Bearer token in Authorization header

## Available Tools

### Links

1. `firelinks_create_link` - create short link
2. `firelinks_get_link` - get link information
3. `firelinks_list_links` - list all links
4. `firelinks_update_link_url` - update link URL
5. `firelinks_add_reserve_url` - add reserve URL

### Statistics

1. `firelinks_stat_days` - statistics by days
2. `firelinks_stat_total` - total statistics for period
3. `firelinks_stat_links` - statistics for all links
4. `firelinks_stat_clicks` - detailed click statistics
5. `firelinks_stat_compare` - compare two periods

### Domains

1. `firelinks_list_domains` - list domains
2. `firelinks_create_domain` - add domain

### Servers

1. `firelinks_list_servers` - list available servers

## Request Examples

### Initialize

```bash
curl -X POST https://mcp.firelinks.cc/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "jsonrpc": "2.0",
    "method": "initialize",
    "params": {},
    "id": 1
  }'
```

### List Tools

```bash
curl -X POST https://mcp.firelinks.cc/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "params": {},
    "id": 1
  }'
```

### Create Link

```bash
curl -X POST https://mcp.firelinks.cc/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "firelinks_create_link",
      "arguments": {
        "url": "https://example.com",
        "type": "url",
        "redirect_type": 0,
        "code": "my-link"
      }
    },
    "id": 1
  }'
```

**Required parameters:**
- `url` - Valid link with http or https
- `type` - The type of link (use "url" for web links)
- `redirect_type` - Redirect type: 0 (301), 1 (302), 2 (303), 4 (META Refresh)

**Optional parameters:**
- `link_name` - Link name
- `code` - Custom link code (must be unique)
- `domain_id` - Domain ID
- `sub_domain` - Subdomain
- `keywords` - Keywords for search
- `keywords_mode` - Keyword search logic (1, 2, or 3)
- `group_id` - Link group ID
- `options` - Additional settings string

### Get Statistics

```bash
curl -X POST https://mcp.firelinks.cc/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "firelinks_stat_days",
      "arguments": {
        "date_from": "2024-01-01",
        "date_to": "2024-01-31"
      }
    },
    "id": 1
  }'
```

### Project Structure

```
mcp-server/
├── src/
│   ├── index.js              # Main Express server file
│   ├── lib/
│   │   ├── laravel-api.js    # HTTP client for Laravel API
│   │   └── mcp-handler.js    # MCP protocol handler
│   └── tools/
│       ├── links.js          # Tools for links
│       ├── statistics.js     # Tools for statistics
│       ├── domains.js        # Tools for domains
│       └── servers.js        # Tools for servers
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## Troubleshooting

### Authentication Error

**Problem**: `Missing or invalid Authorization header`

**Solution**: Make sure the request header contains a valid token:
```
Authorization: Bearer YOUR_API_TOKEN
```

### Request Timeout

**Problem**: Requests to Laravel API timeout

**Solution**: 
1. Check Laravel API availability
2. Increase timeout in `src/lib/laravel-api.js`
3. Check network connectivity between containers

### Server Won't Start

**Problem**: Error on startup

**Solution**:
1. Check logs: `docker logs firelinks-mcp-server`
2. Make sure port 3000 is not in use
3. Check environment variables are correct

## License

MIT

## Support

For questions and support contact support@firelinks.cc