Invitations = new Mongo.Collection('invitations');

Invitations.allow({
    insert: ownsProduct,
    update: ownsDocumentOrAdminOrProductOwner,
    remove: denyPermission
});

Invitations.attachSchema(new SimpleSchema({
    status: {
        type: Number,
        label: "Status",
        min: 0,
        max: 2,
        autoform: {
            omit: true
        }
    },
    productId: {
        type: String,
        autoform: {
            omit: true
        },
        denyUpdate: true
    },
    userId: {
        type: String,
        denyUpdate: true,
        autoform: {
            omit: true
        }
    },
    role: {
        type: Number,
        denyUpdate: true,
        autoform: {
            omit: true
        }
    },
    createdAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) return new Date;
            else if (this.isUpsert) return {$setOnInsert: new Date};
            else
            /* Prevent user from supplying their own date. */
                this.unset();
        },
        autoform: {
            omit: true
        }
    },
    updatedAt: {
        type: Date,
        autoValue: function () {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true
    }
}));

Schema = {};
Schema.invitationUser = new SimpleSchema({
    scrumMaster: {
        type: [String],
        optional: true,
        label: "Scrum Master",
        autoform: {
            type: "select2",
            options: function () {
                /* Find corresponding product. */
                let product = Products.findOne({slug: getRouteSlug()});
                /* Get array with user ids which have an invitation for the current product and either received or accepted the invitation. */
                let invalidUserIds = Invitations.find({$and: [{productId: product._id}, {$or: [{status: 0}, {status: 1}]}]}).map((invitation) => invitation.userId);
                /* We add the current user's id to the array, because we don't want to add ourselves to the project. */
                invalidUserIds.push(Meteor.userId());
                /* Return all users as options which do not have an invitation or declined a previous invitation. */
                return Users.find({_id: {$nin: invalidUserIds}}).map((user) =>  ({
                    label: user.username,
                    value: user._id
                }));
            }
        }
    },
    developmentTeam: {
        type: [String],
        optional: true,
        label: "Development team",
        autoform: {
            type: "select2",
            options: function () {
                /* Find corresponding product. */
                let product = Products.findOne({slug: getRouteSlug()});
                /* Get array with user ids which have an invitation for the current product and either received or accepted the invitation. */
                let invalidUserIds = Invitations.find({$and: [{productId: product._id}, {$or: [{status: 0}, {status: 1}]}]}).map((invitation) => invitation.userId);
                /* We add the current user's id to the array, because we don't want to add ourselves to the project. */
                invalidUserIds.push(Meteor.userId());
                /* Return all users as options which do not have an invitation or declined a previous invitation. */
                return Users.find({_id: {$nin: invalidUserIds}}).map((user) => ({
                    label: user.username,
                    value: user._id
                }));
            }
        }
    },
    productId: {
        type: String,
        autoform: {
            omit: true
        },
        denyUpdate: true,
        custom: function () {
            /* Inserts */
            if (!this.operator) {
                if (!this.isSet || this.value === null || this.value === "") return "required";
                var product = Products.findOne({_id: this.value});
                if (!product) return "invalid product";
            }
        }
    }
});