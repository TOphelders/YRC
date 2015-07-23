'use strict';

let socket = io();

class MessagingDiv extends React.Component {
  render() {
    return (
      <div>
        <SentList sent={[{user_id: 'Test', time_sent: 'Init', content: 'Test content'}]} />
        <PendingList pending={[{user_id: 'Test2', time_sent: 'Init', content: 'Test content 2'}]} />
        <MessageForm />
      </div>
    );
  }
}

class SentList extends React.Component {
  render() {
    return (
      <MessageList messages={this.props.sent} />
    );
  }
}

class PendingList extends React.Component {
  render() {
    return (
      <MessageList messages={this.props.pending} />
    );
  }
}

class MessageList extends React.Component {
  render() {
    let messages = this.props.messages;
    return (
      <div>
        {messages.map(function(message) {
          return <Message username={message.user_id}
                          timestamp={message.time_sent}
                          content={message.content} />;
        })}
      </div>
    );
  }
}

class MessageForm extends React.Component {
  render() {
    return (
      <form>
        <input type='text' />
        <input type='submit' value='Post Reply' />
      </form>
    );
  }
}

class Message extends React.Component {
  render() {
    return (
      <div>
        <div>
          <ProfileLink username={this.props.username} />
          <span>{this.props.timestamp}</span>
          <ProfilePic username={this.props.username} />
        </div>
        <MessageBody content={this.props.content} />
      </div>
    );
  }
}

class ProfileLink extends React.Component {
  render() {
    return (
      <span>
        {this.props.username}
      </span>
    );
  }
}

class ProfilePic extends React.Component {
  render() {
    return (
      <img src=''/>
    );
  }
}

class MessageBody extends React.Component {
  render() {
    return (
      <span>{this.props.content}</span>
    );
  }
}

React.render(
  <MessagingDiv />,
  document.getElementById('app')
);
