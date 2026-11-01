// server-http.js - Plain Node.js server using built-in http module
const http = require('http');

const PORT = 3000;

// Create HTTP server
const server = http.createServer((req, res) => {
  // Set the response HTTP status code to 200 (OK) and header
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  
  // Send the response body
  res.end('Hello');
});

// Start listening on port 3000
server.listen(PORT, () => {
  console.log(`Plain Node.js HTTP server running at http://localhost:${PORT}/`);
});

