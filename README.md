# WebSocket Play

This is an exercise, a case study, on WebSocket(s), not a library nor an app.

My target is to write a WebSocket handler that uses a Promise to get back the response, instead of just write a listener for the `onmessage` event.

WebSocket are great to receive server notifications on the client and then trigger some update accordingly.

But they can be used to fetch data, I have an app that work that way.

If you fetch data, expecially with many different requests and many different responses, writing a proper `onmessage` is not easy.

It would be grat to have a Promise that will fulfill with the response to the request I sent.

I know there are good libraries that works with promisify the WebSocket messages, I just would like to undestrand better the case before starting to choose one of those libraries if I can't get something robust enough by myself.

## Quick start

To try out this package just clone it and then:

```bash
$ npm install
$ npm start
```

Then open the browser and go to `http://localhost:8080/`.


## Challenge

One of the main issues on this kind of approach is to toone the WebSocket session.

It is trivial to open the websocket then close it after the requests is fulfilled.

But open a session for each requests can be slow.

In this exercise I use an object to keep the socket open and if the connection is lost for some reason I attempt to reopen the connection on the next message send.

That attempt will try for a couple of time before fail.

That is necessary because if the server is down or the network is lost the client will continue to try to connect.
