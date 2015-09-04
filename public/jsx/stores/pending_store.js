'use strict';
import { Store } from 'flux/utils';
import { IDList } from '../base.js';
import { MessageActions } from '../actions.js';

export default class PendingStore extends Store {
  constructor(dispatcher) {
    super(dispatcher);
    this._messages = new IDList('message_id');
  }

  get_messages() {
    return this._messages.retrieve_all();
  }

  __onDispatch(payload) {
    let action = payload.action;
    let data = payload.data;
    switch(action) {
      case MessageActions.SEND:
        this._messages.push(data);
        break;
      case MessageActions.POSTED:
        this._messages.remove(data.message_id);
        break;
      default:
        return true;
    }

    this.__emitChange();
    return true;
  }
};
