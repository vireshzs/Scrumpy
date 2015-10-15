/* Register underscore helper. */
Template.registerHelper('_', function () {
    return _;
});

UI.registerHelper('titleShort', function (type) {
    var short = this.title;
    if (short) {
        if (type === "product") {
            if (short.length > 20) {
                short = short.substring(0, 20) + '...';
            }
        } else if (type === "sticky" || type === "story") {
            if (short.length > 50) {
                short = short.substring(0, 50) + '...';
            }
        }
    }
    return short;
});

UI.registerHelper('representative', function () {
    if (this._id) {
        let product = Products.findOne({_id: this._id});
        if (product) return product.advancedMode ? 'Product Owner' : 'Administrator';
    } else return ANONYMOUS;
});

UI.registerHelper('currentUserUsername', function () {
    return Meteor.user().username;
});

UI.registerHelper('defaultAvatar', function () {
    return DEFAULT_AVATAR;
});

UI.registerHelper('noAvatar', function (type) {
    var user;
    if (type === "assignee") {
        user = Users.findOne({_id: this.assigneeId});
        if (user) return !_.has(user.profile, 'image') || user.profile.image.length === 0;
    } else if (type === "currentUser") return !_.has(Meteor.user().profile, 'image') || Meteor.user().profile.image.length === 0;
    else if (type === "profile") return !_.has(this.profile, 'image') || this.profile.image.length === 0;
    else if (type === "productOwnerOrAdministrator") {
        user = Users.findOne({_id: this.userId});
        if (user) return !_.has(user.profile, 'image') || user.profile.image.length === 0;
    }
});

UI.registerHelper('navTabIsActive', function (navTab) {
    return Session.equals('activeNavTab', navTab);
});

UI.registerHelper('advancedMode', function (formId) {
    if (_.has(this, "advancedMode"))return this.advancedMode;
    else return AutoForm.getFieldValue('advancedMode', formId);
});

UI.registerHelper('totalDevTeamMember', function () {
    return Invitations.find({productId: this._id, role: 3}, {$and: [{status: 0}, {status: 1}]}).count();
});

UI.registerHelper('totalScrumMaster', function () {
    return Invitations.find({productId: this._id, role: 2}, {$and: [{status: 0}, {status: 1}]}).count();
});

UI.registerHelper('teamOverview', function (role) {
    return Invitations.find({productId: this._id, role: parseInt(role, 10)}).map(function (document, index) {
        document.isAlreadyInRole = document.status == 1;
        let user = Users.findOne({_id: document.userId});
        if (user) document.username = user.username;
        else document.username = ANONYMOUS;
        document.index = index + 1;
        return document;
    });
});

UI.registerHelper('isOnline', function () {
    if (_.has(this, 'profile') && _.has(this.profile, 'online')) {
        return this.profile.online;
    } else {
        var user = Users.findOne({username: this.username});
        if (user && _.has(user, 'profile') && _.has(user.profile, 'online')) {
            return user.profile.online;
        }
    }
});

UI.registerHelper('avatar', function () {
    if (_.has(this, 'profile') && _.has(this.profile, 'image')) return this.profile.image;
    else return DEFAULT_AVATAR;
});

UI.registerHelper('fullNameOrUsername', function (displayUsername) {
    if (_.has(this, 'profile') && _.has(this.profile, 'firstName') && _.has(this.profile, 'lastName') && this.profile.firstName && this.profile.lastName) return this.profile.firstName + " " + this.profile.lastName;
    else if (displayUsername == "true") return this.username;
    else return ANONYMOUS;
});

UI.registerHelper('userIsScrumMaster', function (template) {
    if (template === "sprint") {
        return Roles.userIsInRole(Meteor.user(), [Template.parentData(2)._id], 'scrumMaster');
    } else if (template === "sprintPlanning") {
        return Roles.userIsInRole(Meteor.user(), [this._id], 'scrumMaster');
    }
});

UI.registerHelper('sprintStartDateFormatted', function () {
    return moment.utc(this.startDate).format('YYYY-MM-DD');
});

UI.registerHelper('sprintEndDateFormatted', function () {
    return moment.utc(this.endDate).format('YYYY-MM-DD');
});

UI.registerHelper('fullName', function () {
    if (_.has(this, 'profile') && _.has(this.profile, 'firstName') && _.has(this.profile, 'lastName')) return this.profile.firstName + " " + this.profile.lastName;
    else return "";
});

UI.registerHelper('userIsProductOwner', function (template) {
    var productId;
    if (template === "userStory") {
        productId = this.productId;
    } else { // template -> sprintPlanning or productPageIncludes
        productId = this._id;
    }
    return Roles.userIsInRole(Meteor.user(), [productId], 'productOwner');
});

isNotEmpty = function (selector, value) {
    if (value && value !== '') {
        return true;
    } else {
        highlightWarningForField(selector);
        return false;
    }
};

highlightWarningForField = function (selector) {
    $(selector).parent().addClass('has-warning has-feedback');
    if ($(selector).parent().children().length === 1) {
        $(selector).parent().append($('<span/>', {'class': 'glyphicon glyphicon-warning-sign form-control-feedback'}));
    }
};

highlightErrorForField = function (selector) {
    $(selector).parent().addClass('has-error has-feedback');
    if ($(selector).parent().children().length === 1) {
        $(selector).parent().append($('<span/>', {'class': 'glyphicon glyphicon-remove form-control-feedback'}));
    }
};

resetAlertsForFields = function () {
    $('.form-control').each(function () {
        $(this).parent().removeClass('has-warning').removeClass('has-error');
        $(this).parent().find('span').remove();
    });
};

setSessionForActiveNavTab = function (name) {
    Session.set('activeNavTab', name);
};

/* Returns slug from router parameters. */
getRouteSlug = function () {
    return Router.current().params.slug;
};

productIsAdvancedModeStartDateEndDate = function (advancedMode) {
    return advancedMode && Router.current().params.startDate && Router.current().params.endDate;
};

getSprintId = function (productId, routerStartDate, routerEndDate) {
    if (productId && routerStartDate && routerEndDate) {
        var sprint = Sprints.findOne({productId: productId, startDate: routerStartDate, endDate: routerEndDate});
        if (sprint) return sprint._id;
    }
};

getUsername = function (userId) {
    let user = Users.findOne({_id: userId});
    if (user) return user.username;
    else return ANONYMOUS;
};

function highlightWarningForRegisterPasswordFields() {
    highlightWarningForField('#register-password');
    highlightWarningForField('#register-password-confirm');
}