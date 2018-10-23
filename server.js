import config from './config';
import apiRouter from './api';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';
import express from 'express';

const server = express();

server.use(sassMiddleware({
    src: path.join(__dirname, 'sass'), // specifies where to read *.scss file from
    dest: path.join(__dirname, 'public/stylesheets'), // specifies where to generated css
    outputStyle: 'compressed',
    prefix: '/public/stylesheets' // important! otherwise css file won't get generated
}));

// api route
server.use('/api', apiRouter);

// route root and /public to public dir
server.use('/', express.static(path.join(__dirname, 'public')));
server.use('/public', express.static(path.join(__dirname, 'public')));

server.listen(config.port, config.host, () => {
    console.info(`Express listening on port ${config.port}`);
});
