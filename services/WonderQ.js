import Message from '../models/Message';
import { Queue } from 'prioqueue'
import { v4 as uuid } from 'uuid'

/* A priority queue, we use maximum priority rather than lowest value to define priority */
const passiveQueue = new Queue((x, y) => x.priority - y.priority);

/* An array that is simply a util that holds all currently "grabbed" by consumers messages, useful to stop the timer */
const activeItems = [];


/**
 * WonderQ is the in memory queueing service, backed by two data structures:
 *   {activeItems} (messages grabbed by consumers) that go back to the queue automatically
 *   if the consumer does not explicitly removes it
 *
 *   {passiveQueue} is a priority queue that holds values pushed by producers and grabbed by consumers
 */
export default class WonderQ {

    /**
     * Generates an Id for a message and wraps it in a Message object, then queues it
     *
     * @param message - the message to queue
     * @returns {Message} - the message object.
     */
    static push(message) {
        const messageId = uuid();
        const queueItem = new Message(messageId, message);
        passiveQueue.enqueue(queueItem.priority, queueItem);
        return queueItem;
    }

    /**
     *
     * Dequeues the highest priority message, and puts it into the active items list
     *
     * @returns {Message} - the Message retrieved from the pop operation
     */
    static pop() {
        if (!this.queueLength()) {
            throw new Error('The queue is empty')
        }
        const queueItem = passiveQueue.dequeue().value;
        activeItems.push(queueItem);
        queueItem.reinsertSelfAfterTimeout(passiveQueue, activeItems);
        return queueItem;
    }

    /**
     * Removes an item from the active list, and clears the timer that would reinsert it back in the queue
     * effectively marked ready for garbage collection and we can forget about it
     *
     * @param id - the id of the message to mark as processed (delete)
     */
    static delete(id) {
        const queueItemIdx = activeItems.findIndex((q) => q.id === id);
        if (queueItemIdx === -1) {
            throw new Error(`Item ${id} either does not exist or its processing window expired`);
        }
        activeItems[queueItemIdx].clearTimer();
        activeItems.splice(queueItemIdx, 1);
    }

    /**
     * @returns {number} - the length of the priority queue
     */
    static queueLength() {
        return passiveQueue.size;
    }
}

