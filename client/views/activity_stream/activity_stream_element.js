"use strict";

Template.activityStreamElement.helpers({
    elType: function (type) {
        return this.type === parseInt(type, 10);
    },
    submittedFormatted: function () {
        return moment(this.submitted).format('MMMM Do YYYY, h:mm:ss a');
    },
    user: function () {
        return Users.findOne({_id: this.userId});
    },
    roleFormatted: function () {
        if (this.role == 1) {
            return "part of the development team";
        } else if (this.role == 2) {
            return "Scrum Master";
        }
    },
    sprintStartDate: function () {
        return moment(this.sprintStartDate).format('YYYY-MM-DD');
    },
    sprintEndDate: function () {
        return moment(this.sprintEndDate).format('YYYY-MM-DD');
    },
    stickyStatusFormatted: function (type) {
        var status = 0;
        if (type === "old") {
            status = this.oldStickyStatus;
        } else if (type === "new") {
            status = this.newStickyStatus;
        }
        if (status == "1") {
            return "ToDo";
        } else if (status == "2") {
            return "Started";
        } else if (status == "3") {
            return "Verify";
        } else if (status == "4") {
            return "Done";
        }
    },
    author: function () {
        var user = Users.findOne({_id: this.userId});
        if (user) {
            if (Meteor.user().username === user.username) {
                return "You";
            }
            return user.username;
        }
    },
    comments: function () {
        return Comments.find({actElId: this._id});
    },
    productTitle: function () {
        return Products.findOne({_id: this.productId}).title;
    }
});