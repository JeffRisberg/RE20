/* eslint-disable no-console */
import express from 'express';
import path from 'path';
import cors from 'cors';
import compression from 'compression';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { health, version } from 'middleware';
import paths from '../config/paths';

const createApp = () => {
    const component = 'app';
    //const isProduction = process.env.NODE_ENV === 'production';
    //const raygunClient = new raygun.Client().init({ apiKey: config.raygunKey });

// create global app object
    const app = express();

// set sensible default HTTP headers
// X-DNS-Prefetch-Control: off                | disable browser DNS prefetching
// X-Frame-Options: SAMEORIGIN                | frameguard to mitigate clickjacking
// Strict-Transport-Security: max-age=5184000 | keep user on HTTPS
// X-Content-Type-Options: nosniff            | prevent browser guessing MIME types
// X-Download-Options: noopen                 | prevent IE8 executing downloads
// X-XSS-Protection: 1; mode=block            | prevent reflected XSS attacks
// remove X-Powered-By header
    app.use(helmet());

// configure CORS headers
// Access-Control-Allow-Origin: * | enable all CORS requests
    app.use(cors());

// Compress all responses
    app.use(compression());

// serve the default, implicit favicon | GET /favicon.ico
    app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// serve public directory
    app.use(['/static', paths.publicPath], express.static(path.join(__dirname, 'public')));

// parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
    app.use(bodyParser.json());

// parse Cookie header and populate req.cookies
    app.use(cookieParser());

    app.use(health);
    app.use(version);

    //app.use(requestLogger({ component }));

    import(`./renderer/dev-server`)
        .then((module) => {
            app.get('*', module.default());
            //app.use(errorLogger({ component }));
            //app.use(raygunClient.expressHandler);
        });

    return app;
};

export default createApp;
