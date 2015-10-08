"use strict";

var insertProductHooks = {
    onSuccess: function (formType, result) {
        Meteor.call('getProductSlug', result, function (error, response) {
            if (error) {
                throwAlert("error", error.reason, error.details);
                return;
            }
            DashboardStatisticsPrivate.insert({productId: result, data: []});
            Meteor.call('createActElProductCreate', result, Meteor.userId(), function (error) {
                if (error) {
                    throwAlert('error', error.reason, error.details);
                    return;
                }
                Meteor.call('createRole', result, Meteor.userId(), function (error) {
                    if (error) {
                        throwAlert('error', error.reason, error.details);
                        return;
                    }
                    Session.set('productCreate', true);
                    Router.go('invite', {slug: response});
                });
            });
        });
    }
};

var updateProductHooks = {
    onSuccess: function (formType, result) {
        /* We need to retrieve the updated product, because the title/slug may have changed. */
        let product = Products.findOne({_id: this.currentDoc._id});
        if (product) {
            if (product.advancedMode) Router.go('productDashboard', {slug: product.slug});
            else Router.go('taskBoardPage', {slug: product.slug});
        } else Router.go('dashboard');

    }
};

AutoForm.addHooks('insert-products-form', insertProductHooks);
AutoForm.addHooks('update-products-form', updateProductHooks);