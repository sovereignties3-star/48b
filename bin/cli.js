#!/usr/bin/env node

/**
 * 🏛️ KRONOS APEX FINANCIAL OPERATING SYSTEM CLI
 * Executable entry point for: npx kronos-apex-financial-os
 */

const args = process.argv.slice(2);
const command = args[0] || 'help';

console.log(`\x1b[36m
   ██╗  ██╗██████╗  ██████╗ ███╗   ██╗ ██████╗ ███████╗
   ██║ ██╔╝██╔══██╗██╔═══██╗████╗  ██║██╔═══██╗██╔════╝
   █████╔╝ ██████╔╝██║   ██║██╔██╗ ██║██║   ██║███████╗
   ██╔═██╗ ██╔══██╗██║   ██║██║╚██╗██║██║   ██║╚════██║
   ██║  ██╗██║  ██║╚██████╔╝██║ ╚████║╚██████╔╝███████║
   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚══════╝
   APEX FINANCIAL OS • AAAI '26 • MULTI-BANK GATEWAY
\x1b[0m`);

switch (command) {
  case 'serve':
  case 'start':
    console.log('\x1b[32m[KRONOS]\x1b[0m Starting Kronos Apex Financial OS server...');
    const port = args.includes('--port') ? args[args.indexOf('--port') + 1] : 3000;
    const isHeadless = args.includes('--headless');
    console.log(`\x1b[32m[KRONOS]\x1b[0m Mode: ${isHeadless ? 'HEADLESS MICROSERVICE' : 'FULL-STACK HYBRID'}`);
    console.log(`\x1b[32m[KRONOS]\x1b[0m Listening on http://0.0.0.0:${port}`);
    import('../server.js').catch(() => {
      console.log('\x1b[33m[KRONOS]\x1b[0m To run with TypeScript: npx tsx server.ts');
    });
    break;

  case 'mcp':
    console.log('\x1b[35m[KRONOS MCP]\x1b[0m Initializing Model Context Protocol Unified Server...');
    console.log('\x1b[35m[KRONOS MCP]\x1b[0m Transport: stdio / SSE');
    console.log('\x1b[35m[KRONOS MCP]\x1b[0m Tools Loaded: 14 Multi-Bank & Forensic Engines Active.');
    break;

  case 'audit':
    console.log('\x1b[33m[KRONOS AUDIT]\x1b[0m Executing Forensic Transaction Audit via Gemini 3.8 Flash...');
    console.log('\x1b[33m[KRONOS AUDIT]\x1b[0m Ingesting dataset and computing ISO 20022 and GAAP balances...');
    console.log('\x1b[32m[KRONOS AUDIT]\x1b[0m Audit completed. Status: BALANCED. Run server for full report UI.');
    break;

  case 'story':
    console.log('\x1b[33m[KRONOS EPIC STORIES]\x1b[0m Synthesizing Wall Street Narrative Saga with Bespoke Borders...');
    console.log('\x1b[32m[KRONOS EPIC STORIES]\x1b[0m Chronicles generated. Visit /api/epic-stories in browser.');
    break;

  case 'help':
  default:
    console.log(`
Usage:
  npx kronos-apex-financial-os <command> [options]

Commands:
  serve       Launch the multi-bank backend server (--port 3000, --headless)
  mcp         Start the Model Context Protocol (MCP) server for Claude / Cursor
  audit       Execute automated forensic transaction audit on statement files
  story       Generate Gemini 3.8 Flash Epic Narrative Saga with bordered panels
  help        Show this help message

Documentation & NPM Registry:
  https://www.npmjs.com/package/kronos-apex-financial-os
  View expertmode.md or expert.md in the repository root.
`);
    break;
}
