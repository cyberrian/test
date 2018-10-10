import config from './config';
import apiRouter from './api';
import express from 'express';

const server = express();

server.use('/api', apiRouter);
server.use(express.static('public')); // shortcut to below, to serve static html from public dir
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
