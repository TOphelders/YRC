'use strict';
import { AppDispatcher } from '../base.js';
import { default as SentStore } from './sent_store.js';
import { default as PendingStore } from './pending_store.js';

let sent_store = new SentStore(AppDispatcher);
let pending_store = new PendingStore(AppDispatcher);

export default {
  sent_store: sent_store,
  pending_store: pending_store
};
