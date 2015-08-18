"use strict";

Template.comment.helpers({
    submittedFormatted: function () {
        return moment(this.submitted).format('MMMM Do YYYY, h:mm:ss a');
    },
    productOwnerOrOwnerOfComment: function () {
        var actEl = ActivityStreamElements.findOne({_id: this.actElId});
        if (actEl) {
            return (this.userId == Meteor.userId()) || Roles.userIsInRole(Meteor.userId(), [actEl.productId], 'productOwner');
        }
    },
    author: function () {
        return Users.findOne({_id: this.userId}).username;
    },
    user: function () {
        return Users.findOne({_id: this.userId});
    },
    editComment: function () {
        return Template.instance().isEditing.get();
    }
});

Template.comment.created = function () {
    this.isEditing = new ReactiveVar(false);
};

Template.comment.events({
    'click .delete-comment': function (e) {
        e.preventDefault();
        throwDialog('warning', 'Wait!', 'Are you sure you want delete this comment?', 'Relax, I know what I am doing', 'No, do not delete', 'delete-comment-confirm', this);
    },

    'click .edit-comment': function (e, t) {
        e.preventDefault();
        t.isEditing.set(true);
    },

    'click .edit-comment-submit-button': function (e, t) {
        e.preventDefault();
        var editCommentInput = t.find('[name=edit-comment-input]');
        Comments.update({_id: this._id}, {$set: {body: editCommentInput.value}});
        t.isEditing.set(false);
    },

    'click .edit-comment-cancel-button': function (e, t) {
        t.isEditing.set(false);
    }
});