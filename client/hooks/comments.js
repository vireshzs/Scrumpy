"use strict";

var commentsInsertHooks = {
    before: {
        insert: function (doc) {
            /* Extend our document (comment) with a reference to the corresponding activity stream element. */
            doc.actElId = this.currentDoc._id;
            return doc;
        }
    },
    onSuccess: function (formType, result) {
        Meteor.call('createNotificationsForComment', result, function (error) {
            if (error) {
                throwAlert('error', error.reason, error.details);
            }
        });
    }
};

AutoForm.addHooks('insert-comment-form', commentsInsertHooks);