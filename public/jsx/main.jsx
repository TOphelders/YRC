'use strict';
import { React } from './base.js';
import { default as stores } from './stores/stores.js';
import { MessagingDiv } from './messages_view.jsx';

let socket = io();

React.render(
  <MessagingDiv />,
  document.getElementById('app')
);
