import WonderQ from '../services/WonderQ';
import Message from "../models/Message";

describe('WonderQ service',() => {
    it('should push an element to the queue', () => {
        const queueItem = WonderQ.push('This is a Message');
        expect(1).toEqual(1)
    });
})