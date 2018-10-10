import express from 'express';

const router = express.Router();

// NOTE: this '/' route is appended to route specified in server.js' server.use('./api', apiRouter)
// so the absolute path to trigger this is http://domain.com/api
// If router.get('/hi', ...) here, absolute path is http://domain/com/api/hi
router.get('/', (req, res) => {
    res.send({
        data: []
    });
});

export default router;
