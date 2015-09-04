'use strict';
import { React } from '../base.js';

export class MessagingDiv extends React.Component {
  render() {
    return (
      <div className='messagingDiv'>
        <SentList sent={[{message_id: 'asdf', user_id: 'fsa', username: 'Test', time_sent: 'Init', content: 'Test content'}]} />
        <PendingList pending={[{message_id: 'fff', user_id: 'ffff', username: 'Test2', time_sent: 'Init', content: 'Test content 2'}]} />
        <MessageForm />
      </div>
    );
  }
}

class SentList extends React.Component {
  /*
   * Display any messages that are guaranteed to
   * have been recieved by the server
   */
  render() {
    return (
      <MessageList messages={this.props.sent} />
    );
  }
}

class PendingList extends React.Component {
  /*
   * Display any messages that have not yet been
   * recieved by the server
   */
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
      <div className='messageList'>
        {messages.map(function(message) {
          return <Message username={message.username}
                          timestamp={message.time_sent}
                          content={message.content}
                          key={message.message_id}/>;
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
