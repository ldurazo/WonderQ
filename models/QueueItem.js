import config from '../config.json';

export default class QueueItem {
    id;
    message;
    timer;

    constructor(id, message) {
        this.id = id;
        this.message = message;
    }

    reinsertSelfAfterTimeout(queue, activeItems) {
        this.timer = setTimeout(() => {
            // Puts itself at the front of the list
            queue.unshift(this);

            // Removes itself from the active items list
            const queueItemIdx = activeItems.findIndex((q) => q.id === this.id);
            activeItems.splice(queueItemIdx, 1);

            // Log this action
            console.log(`Item ${this.id} reinserted itself to the queue after processing time ended`);
        }, config.queueUnprocessedTimeInMilliseconds)
    }

    clearTimer() {
        console.log(`Item ${this.id} has been cleared`);
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }
}