import Dequeue from 'dequeue';
import QueueItem from '../models/QueueItem';

const passiveQueue = new Dequeue();
const activeItems = [];

export default class WonderQ {
    static push(id, message) {
        const queueItem = new QueueItem(id, message);
        passiveQueue.push(queueItem);
        return queueItem;
    }

    static pop() {
        if (!this.queueLength()) {
            throw new Error('The queue is empty')
        }
        const queueItem = passiveQueue.shift();
        activeItems.push(queueItem);
        queueItem.reinsertSelfAfterTimeout(passiveQueue, activeItems);
        return queueItem;
    }

    static delete(id) {
        const queueItemIdx = activeItems.findIndex((q) => q.id === id);
        if (queueItemIdx === -1) {
            throw new Error(`Item ${id} either does not exist or its processing window expired`);
        }
        activeItems[queueItemIdx].clearTimer();
        activeItems.splice(queueItemIdx, 1);
    }

    static queueLength() {
        return passiveQueue.length;
    }
}

