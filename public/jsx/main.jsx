'use strict';
import { MessagingDiv } from './messages.jsx';

let socket = io();

React.render(
  <MessagingDiv />,
  document.getElementById('app')
);
