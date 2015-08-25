'use strict';
import { Dispatcher } from 'flux';

export class IDList {
  /*
   * A class to store items to be displayed;
   * allows for O(1) retrieval and modification
   * by both index and id
   */
  constructor(id_prop, list) {
    this._id_prop = id_prop;
    this._list = [];
    this._ids = {};

    if (typeof list === 'undefined') return;
    for (let item of list) {
      this._ids[item[id_prop]] = this._list.length;
      this._list.push(item);
    }
  }

  retrieve(id) {
    let index = (typeof id === 'string') ? this._ids[id] : id;
    return this._list[index];
  }

  retrieve_all() {
    return this._list;
  }

  push(item) {
    this._ids[item[this._id_prop]] = this._list.length;
    this._list.push(item);
  }

  modify(id, update) {
    let index = (typeof id === 'string') ? this._ids[id] : id;
    if(!index || index >= this.length || index < 0) return;
    this._list[index] = update;
  }

  remove(id) {
    let index;
    if(typeof id === 'string') {
      index = this._ids[id];
      if(!index) return;
    } else {
      if(!this._list[id]) return;
      [id, index] = [this._list[id][this._id_prop], id];
    }

    this._list.splice(index, 1);
    delete this._ids[id];

    for (let i = index; i < this._list.length; i++) {
      let cur = this._list[i][this._id_prop];
      this._ids[cur]--;
    }
  }

  concat(other) {
    let list = new IDList(this._list);
    for(let item of other) list.push(item);
    return list;
  }

  get length() {
    return this._list.length;
  }

  [Symbol.iterator]() {
    let index = -1;
    return {
      next: () => ({value: this._list[++index],
                    done: index == this._list.length})
    };
  }
};

export { default as React } from 'react';
export let AppDispatcher = new Dispatcher();
export let MessageActions = {
  RETRIEVE_SET: 'message-retrieve-set',   // A set of messages gotten
  SEND: 'message-send',                   // Message added by user
  POSTED: 'message-posted',               // Message successfully sent
  RETRIEVE: 'message-retrieve',           // A single message gotten
  EDITED: 'message-edited',               // Message successfully edited
  EDIT: 'message-edit',                   // User attempted to edit message
  DELETED: 'message-deleted',             // Message successfully deleted
  DELETE: 'message-delete'                // Message marked for deletion
};
