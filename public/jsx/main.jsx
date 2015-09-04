'use strict';
import { React, AppDispatcher, socket } from './base.js';
import { default as stores } from './stores/stores.js';
import { MessagingDiv } from './views/messages_view.jsx';

socket.on('connect', function() {
  console.log('Connected!');
});
socket.on('message-reply', function(payload) {
  AppDispatcher.dispatch(payload);
});

React.render(
  <MessagingDiv />,
  document.getElementById('app')
);
