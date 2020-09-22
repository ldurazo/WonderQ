import WonderQ from '../services/WonderQ';
import Message from "../models/Message";

const uuidRegEx = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('WonderQ service', () => {
    beforeAll(async () => {
        jest.setTimeout(60000);
    })

    it('should push and pop elements to the queue', async () => {
        // Item inserted by producer
        const message = 'This is a Message';
        let queueItem = WonderQ.push(message);
        expect(queueItem.message).toEqual(message);
        expect(queueItem.priority).toEqual(0);
        expect(uuidRegEx.test(queueItem.id)).toBeTruthy();
        expect(WonderQ.queueLength()).toEqual(1);

        // Item read by consumer
        queueItem = WonderQ.pop();
        expect(queueItem.message).toEqual(message);
        expect(queueItem.priority).toEqual(0);
        expect(uuidRegEx.test(queueItem.id)).toBeTruthy();
        expect(WonderQ.queueLength()).toEqual(0);

        // TODO: if configuration changes, test breaks
        // Wait until reinsertion happens
        await sleep(2000);

        // Item reinserted itself with higher priority
        expect(WonderQ.queueLength()).toEqual(1);
        queueItem = WonderQ.pop();
        expect(queueItem.message).toEqual(message);
        expect(queueItem.priority).toEqual(1);
        expect(WonderQ.queueLength()).toEqual(0);

        // Item should reappear once more
        await sleep(2000);

        // Item popped and removed, should not reappear
        WonderQ.pop();
        WonderQ.delete(queueItem.id);

        // Wait for a reasonable time, reinsertion should happen
        await sleep(3000);

        // After waiting, the item does not reinserts itself
        expect(WonderQ.queueLength()).toEqual(0);
    });
})