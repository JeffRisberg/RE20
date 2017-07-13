/* eslint-disable no-console */
import http from 'http';
import createApp from './app';

const component = 'app';

global.__SERVER__ = true;

// RUN app on ssl only on localhost
//const isLocalhost = Boolean(process.env.NODE_ENV === 'localhost');
//const isProduction = process.env.NODE_ENV === 'production';
//const isProdRunningOnLocalhost = isProduction && Boolean(process.env.RUNNING_ENV === 'localhost');
//const isLocalSsl = (isLocalhost || isProdRunningOnLocalhost);

// Server storage based on env
let server;

// Normalize a port into a number, string, or false.
function normalizePort(val) {
    const portAsInt = parseInt(val, 10);

    if (isNaN(portAsInt)) {
        // named pipe
        return val;
    }

    if (portAsInt >= 0) {
        // port number
        return portAsInt;
    }
    return false;
}

// Get port from environment or config and store in Express.
const port = normalizePort(process.env.PORT || 3000);

// Event listener for HTTP server "error" event.
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? `Pipe ${port}`
        : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated priviledges`); // eslint-disable-line no-console
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`); // eslint-disable-line no-console
            process.exit(1);
            break;
        default:
            throw error;
    }
}

// Event listener for HTTP server "listening" event.
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? `pipe ${addr}`
        : `port ${addr.port}`;
    if (isLocalSsl) {
        const url = `https://eua.local.justgiving.com:${port}/user-account`;
        console.log('\x1b[36m%s\x1b[0m', `
      ====================================================================
      App is running on: ${url}
      ====================================================================
    `);
    } else {
        console.log(`Listening on ${bind}`); // eslint-disable-line no-console
    }
}

// Create HTTP server.
function createServer(app) {
    server = http.createServer(app);
    // Listen on provided port, on all network interfaces.
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
}

console.log("ping1");
const app = createApp();
console.log("ping2");
app.set('port', port);
createServer(app);
console.log("ping3");
