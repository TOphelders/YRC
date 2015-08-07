'use strict';
import { React } from './base.js';
import { MessagingDiv } from './messages.jsx';

let socket = io();

React.render(
  <MessagingDiv />,
  document.getElementById('app')
);
