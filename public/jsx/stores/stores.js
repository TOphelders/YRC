'use strict';
import { AppDispatcher } from '../base.js';
import { default as SentStore } from './sent_store.js';
import { default as PendingStore } from './pending_store.js';

export default {
  sent_store: new SentStore(AppDispatcher),
  pending_store: new PendingStore(AppDispatcher)
};
