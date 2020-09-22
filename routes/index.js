import express from 'express';
import WonderQ from '../services/WonderQ.js';

const router = express.Router();

/**
 * Consumer endpoint, returns the highest priority message in the queue or returns an error if the queue is empty
 */
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

/**
 * Producer endpoint, enqueues a message and returns the generated id
 */
router.post('/', (req, res) => {
    const queueItem = WonderQ.push(req.body.message);
    res.json({messageId: queueItem.id});
});

/**
 * Consumer endpoint, deletes a message that was previously set as processed. Can't be deleted if it wasn't read
 *
 * @param {id} - the uuid of the message to mark as processed (delete)
 */
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    try {
        WonderQ.delete(id);
    } catch (e) {
        res.send({error: e.message});
        throw e;
    }
    res.json({message: `item ${id} removed successfully`});
});

/**
 * Utility endpoint, returns the length of the queue
 */
router.get('/length', (req, res) => {
    res.json(JSON.stringify({queueLength: WonderQ.queueLength()}));
});


export default router;
