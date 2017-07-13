import { compose } from 'compose-middleware';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { Auth, redirectToLogin } from 'utils';
import webpackConfig from '../../config/webpack.dev';
import paths from '../../config/paths';
import config from '../config';

function renderFullPage(assetsByChunkName) {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${config.appName}</title>
        ${
          assetsByChunkName.main
            .filter((filename) => /\.css$/.test(filename))
            .map((filename) => `<link href="${paths.publicPath}${filename}" rel="stylesheet" />`)
        }
      </head>
      <body>
        <div id="root"></div>
        <script>
          window.__CONFIG__ = ${JSON.stringify(config).replace(/</g, '\\u003c')}
        </script>
        <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
        </script>
        ${
          assetsByChunkName.main
            .filter((filename) => /\.js$/.test(filename))
            .map((filename) => `<script src="${paths.publicPath}${filename}"></script>`)
        }
      </body>
    </html>
  `;
}

function requestHandler(req, res, next) {
  const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName;
  Auth.initializeFromRequest(req);

  // not logged in  && request page is not redirect/mockLogin page
  if (!Auth.exists() && !req.path.includes('redirect')) {
    const isMock = Boolean(process.argv.slice(2).includes('mock'));
    return redirectToLogin(req, res, isMock);
  }
  return res.send(renderFullPage(assetsByChunkName));
}

function devServer() {
  const compiler = webpack(webpackConfig);

  return compose([
    webpackDevMiddleware(compiler, {
      publicPath: paths.publicPath,
      stats: 'normal',
      serverSideRender: true,
    }),
    webpackHotMiddleware(compiler),
    requestHandler,
  ]);
}

export default devServer;
