const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (ws) => {
  console.log('New client connected');
  
  // Send a welcome message to the newly connected client
  const dataToSend = { message: 'connected', timestamp: Date.now() };
  ws.send(JSON.stringify(dataToSend));

  ws.on('message', (message) => {
    try {
      // Parse the received message to ensure it is JSON
      const receivedData = JSON.parse(message);
      console.log('Received message:', receivedData);

      // Broadcast the message to all connected clients
      server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          // Send the message as a JSON string
          client.send(JSON.stringify(receivedData));
        }
      });
    } catch (error) {
      console.error('Error parsing or broadcasting message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server started on ws://localhost:8080');
