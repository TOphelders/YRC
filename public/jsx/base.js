'use strict';
import { Dispatcher } from 'flux';

export class IDList {
  /*
   * A class to store items to be displayed,
   * allows for O(1) retrieval and modification
   * by both index and message id
   */
  constructor() {
    this._messages = [];
    this._ids = {};
  }

  retrieve(id) {
    let index = (typeof id === 'string') ? this._ids[id] : id;
    return this._messages[index];
  }

  push(message) {
    this._ids[message.message_id] = this._messages.length;
    this._messages.push(message);
  }

  modify(id, update) {
    let index = (typeof id === 'string') ? this._ids[id] : id;
    this._messages[index] = update;
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

  get length() {
    return this._messages.length;
  }

  [Symbol.iterator]() {
    let index = -1;
    return {
      next: () => ({value: this._messages[++index],
                    done: index == this._messages.length})
    };
  }
};

export let appDispatcher = new Dispatcher();
export { default as React } from 'react';
