import config from '../config.json';

/**
 * A wrapper class for a message used in the queue system
 */
export default class Message {
    /* The uuid generated for this message */
    id;
    /* The message itself */
    message;

    /* when defined, it means that this message is getting ready to insert itself back into the queue */
    timer;

    /* the priority of this message in the queue */
    priority;

    /**
     * Default priority is 0.
     *
     * @param id - the generated uuid for this message
     * @param message - the message
     */
    constructor(id, message) {
        this.id = id;
        this.message = message;
        this.priority = 0
    }

    /**
     * TODO: this method should probably belong in a service, it's breaking single responsibility
     *
     * Whenever a messages is pushed into the queue, this function executes and will reinsert this item back in
     * with a higher priority if the consumer does not explictly deletes the message
     *
     * @param queue
     * @param activeItems
     */
    reinsertSelfAfterTimeout(queue, activeItems) {
        this.timer = setTimeout(() => {
            // Puts itself with a higher priority back in the queue
            queue.enqueue(this.priority++, this);

            // Removes itself from the active items list
            const queueItemIdx = activeItems.findIndex((q) => q.id === this.id);
            activeItems.splice(queueItemIdx, 1);

            // Log this action
            console.log(`Item ${this.id} reinserted itself to the queue after processing time ended`);
        }, config.queueUnprocessedTimeInMilliseconds)
    }

    /**
     * TODO: likely to be removed with this#reinsertSelfAfterTimeout if refactored.
     *
     * Clears the timer to effectively stop this item from reinserting itself into the queue
     */
    clearTimer() {
        console.log(`Item ${this.id} has been cleared`);
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }
}