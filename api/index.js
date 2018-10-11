import express from 'express';

const router = express.Router();

// NOTE: this '/data' route is appended to route specified in server.js => server.use('./api', apiRouter)
// so the absolute path to trigger this is http://domain.com/api/data
router.get('/data', (req, res) => {
    res.send({
        testArray: [
            'a', 'b', 'c'
        ],
        testObject: {
            'x': 1,
            'y': 2
        }
    });
});

export default router;
