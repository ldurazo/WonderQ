# WonderQ

WonderQ is a simple, in memory, fast message queue for general purposes backed by a priority queue.

#### Endpoints for consumers:

<b>```GET /```</b>

Root Address gets you the message in the queue with the highest priority in the following format:
```
{
  "id": "{uuid}",
  "message": "This is a message"
}
```
Where `Id` is a generated uuid and `message` is the content being sent.

<b>```DELETE /:id```</b>

Will mark a message as processed, be warned that if the processing time window has expired the item will return to the queue.

The response will be a confirmation or error message:

Sucess:
```
{
  "message": "item {uuid} removed successfully"
}
```

Error:

```
{
  "error": "item {uuid} either does not exist or its processing window expired"
}
```
#### Endpoints for producers:

<b>```POST /```</b>

Will enqueue a message, the request body format must contain "message" as key and the message content as value, no other parameters are required.

i.e.

```
{
  "message": "This is a message"
}
```

#### Utility Endpoints:

<b>```GET /length```</b>

Returns the number of items in the queue in the following format:

```
{
  "queueLength": 0
}
```

### Future Features/Known Issues
- Authentication for Producers and Consumers, so that no Consumer can remove that is being processed by another Consumer if it happens to know it's uuid. 
 Preferably with a lightweight solution similar to Feathers.js authentication tools.
- Different data sources and layers for the messaging queues, 
  - Are the messages short lived and high volume? consider an in-memory cache system like couchbase or Redis. 
  - Are the messages very high in volume but also take a long time to be grabbed by a consumer? are the messages bound to a schema? Use postgres, but more likely than not the objects will be more generic so a NoSQL database make more sense.
  - Is the volume getting worldwide big? since uuid's were created from the initial design, database sharding is possible to distribute among CDN's.
- Make tests configurable, split test and prod configurations.
  - Add automated E2E testing, SuperTest seems to fit the case, Cypress could be considered if a client is underway
- Add out of the box API wrappers! similar to what other API's do, give your users published and maintained libraries that they can use reducing the amount of user facing issues (with a higher maintenance cost, though)

#### Disclaimer
This is not a production ready project, and should serve educational purposes only.
