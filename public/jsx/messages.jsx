'use strict';

var socket = io();

class MessagingDiv extends React.Component {
  render() {
    return (
      <div className='messagingDiv'>
        MessagingDiv
      </div>
    );
  }
}

class SentList extends React.Component {
  render() {
    return (
      <div className='sentList'>
        SentList
      </div>
    );
  }
}

class PendingList extends React.Component {
  render() {
    return (
      <div className='pendingList'>
        PendingList
      </div>
    );
  }
}

class MessageForm extends React.Component {
  render() {
    return (
      <div className='messageForm'>
        MessageForm
      </div>
    );
  }
}

class Message extends React.Component {
  render() {
    return (
      <div className='message'>
        Message
      </div>
    );
  }
}

React.render(
  <MessagingDiv />,
  document.getElementById('app')
);
