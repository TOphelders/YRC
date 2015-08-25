'use strict';
import { Store } from 'flux/utils';
import { IDList, MessageActions } from '../base.js';

export default class SentStore extends Store {
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
      case MessageActions.RETRIEVE_SET:
        let retrieved = new IDList('message_id', data);
        // if(data[0].time_sent after retrieved[0].time_sent)
        //   this._messages = this._messages.concat(retrieved);
        // else
        //   this._messages = retrieved.concat(this._messages);
        this._messages = this._messages.concat(retrieved);
      case MessageActions.POSTED:
        this._messages.push(data);
      case MessageActions.EDITED:
      case MessageActions.DELETED:
        this._messages.modify(data.message_id, data);
    }
  }
};
