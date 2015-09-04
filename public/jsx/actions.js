'use strict';
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
