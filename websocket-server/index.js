const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  console.log('New client connected');

  ws.on('message', message => {
    console.log(`Received message -> ${message}`);
    ws.send(`${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    console.log("---------------------");
  });
});

console.log('WebSocket server started on ws://localhost:8080');