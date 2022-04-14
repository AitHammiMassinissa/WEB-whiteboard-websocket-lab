const DRAW_TYPE = 'draw';
const LINE_TYPE = 'line';
const ALL_DRAW = 'draws';
const CALQUE = 'calque';

var http = require('http'),
    WebSocketServer = require('ws').Server,
    port = 1234,
    host = '0.0.0.0';

// create a new HTTP server to deal with low level connection details (tcp connections, sockets, http handshakes, etc.)
var server = http.createServer();

var draws = {
  type: "draws",
  value: [
    {
      type: 'draw',
      name: 'index',
      value: [],
    }
  ]
};


// create a WebSocket Server on top of the HTTP server to deal with the WebSocket protocol
var wss = new WebSocketServer({
  server: server
});

// create a function to be able do broadcast messages to all WebSocket connected clients
wss.broadcast = function broadcast(message) {
  wss.clients.forEach(function each(client) {
    client.send(message);
  });
};

// Register a listener for new connections on the WebSocket.
wss.on('connection', function(client, request) {
  client.send(JSON.stringify(draws));

  client.on('message', function (message) {
    let array = JSON.parse(message);
    if (array.type) {
      if (array.type === LINE_TYPE) {
        if (JSON.stringify(array.value)) {
          for (let i = 0; i < draws.value.length; i++) {
            if (draws.value[i].name === array.name) {
              draws.value[i].value.push(JSON.parse(message))
            }
          }
        }
      } else if (array.type === CALQUE && array.value) {
        draws.value.push({
          type: DRAW_TYPE,
          name: array.value,
          value: [],
        });
      }
    }
    wss.broadcast(message);
  });
});


// http sever starts listening on given host and port.
server.listen(port, host, function() {
  console.log('Listening on ' + server.address().address + ':' + server.address().port);
});

process.on('SIGINT', function() {
  process.exit(0);
});
