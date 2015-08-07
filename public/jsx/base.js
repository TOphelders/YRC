import { Dispatcher } from 'flux';

export class MessageList {
  constructor() {
    this._messages = [];
    this._ids = {};
  }

  at(index) {
    return this._messages[index];
  }

  from_id(id) {
    let index = this._ids[id];
    return this._messages[index];
  }

  push(message) {
    this._ids[message.message_id] = this._messages.length;
    this._messages.push(message);
  }

  remove(id) {
    let index = this._ids[id];
    this._messages.splice(index, 1);
    delete this._ids[id];

    for (let i = index; i < this._messages.length; i++) {
      let cur = this._messages[i].message_id;
      this._ids[cur]--;
    }
  }

  [Symbol.iterator]() {
    var index = -1;
    return {
      next: () => ({value: this._messages[++index],
                    done: index == this._messages.length})
    };
  }
};

export let appDispatcher = new Dispatcher();
export { default as React } from 'react';
