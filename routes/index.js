import express from 'express';
import WonderQ from '../services/WonderQ';

const router = express.Router();

router.get('/', (req, res) => {
    let queueItem;
    try {
        queueItem = WonderQ.pop();
    } catch (e) {
        res.send({error: 'Queue could not be polled, check its status with /length'});
        throw e;
    }
    res.json(JSON.stringify({id: queueItem.id, message: queueItem.message}));
});

router.post('/', (req, res) => {
    const key = WonderQ.queueLength() + 1; // In the absence of elegance, practicality.
    WonderQ.push(key, req.body.message);
    res.json({messageId: key, queueLength: WonderQ.queueLength()});
});

router.delete('/:id', (req, res) => {
    let id = Number(req.params.id);
    try {
        WonderQ.delete(id);
    } catch (e) {
        res.send({error: e.message});
        throw e;
    }
    res.json({message: `item ${id} removed successfully`});
});

router.get('/length', (req, res) => {
    res.json(JSON.stringify({queueLength: WonderQ.queueLength()}));
});


export default router;
