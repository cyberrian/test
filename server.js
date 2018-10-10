import config from './config';
import apiRouter from './api';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';

import express from 'express';

const server = express();

server.use(sassMiddleware({
    src: path.join(__dirname, 'sass'), // specifies where to read *.scss file from; starting from current directory, join sass dir
    dest: path.join(__dirname, 'public/stylesheets'), // specifies where to write generated css
    outputStyle: 'compressed',
    prefix: '/public/stylesheets' // where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

server.use('/api', apiRouter);
server.use(express.static(path.join(__dirname, 'public'))); // shortcut to below, to serve static html from public dir
/* Long-winded way to serve static html
server.get('/about.html', (req, res) => {
    fs.readFile('./about.html', (err, data) => {
        res.send(data.toString());
    });
});
*/

server.listen(config.port, () => {
    console.info(`Express listening on port ${config.port}`);
});
