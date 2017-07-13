const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath) {
    return path.resolve(appDirectory, relativePath);
}

module.exports = {
    srcDir: resolveApp('app/js'),
    clientEntry: resolveApp('app/js/client.js'),
    serverEntry: resolveApp('app/js/server.js'),

    outputDir: resolveApp('dist'),
    staticDir: resolveApp('dist/public'),

    node_modules: resolveApp('node_modules'),

    /*
     srcDir: resolveApp('src'),
     polyfills: resolveApp('src/polyfills.js'),
     clientEntry: resolveApp('src/client.js'),
     serverEntry: resolveApp('src/server.js'),
     publicDir: resolveApp('src/public'),

     outputDir: resolveApp('dist'),
     staticDir: resolveApp('dist/public'),

     basename: '/user-account',
     publicPath: '/user-account/static/',
     node_modules: resolveApp('node_modules'),
     */
};
