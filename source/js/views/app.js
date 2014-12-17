var Backbone = require('backbone');

var ToolbarView = require('./toolbar');
var FeedHeaderView = require('./feedHeader');
var FeedBodyView = require('./feedBody');
var SettingsView = require('./settings');
var Settings = require('../models/settings');

var AppView = Backbone.View.extend({

    template: require('../templates/app.hbs'),

    initialize: function(opts) {
        this.model = new Settings(null, { webSocketManager: opts.webSocketManager });
        this.webSocketManager = opts.webSocketManager;
    },

    render: function() {
        var $markup = $(this.template());

        this._renderChildViews($markup);

        this.$el.html($markup);

        return this;
    },

    _renderChildViews: function($markup) {
        var toolbarView =    this._renderToolbar($markup);
        var settingsView =   this._renderSettings($markup);
        var feedHeaderView = this._renderFeedHeader($markup);
        var feedBodyView =   this._renderFeedBody($markup);

        this.listenTo(toolbarView, 'searchChanged', feedBodyView.filterRequests.bind(feedBodyView));
        this.listenTo(toolbarView, 'showSettings', settingsView.show.bind(settingsView));
        this.listenTo(toolbarView, 'clearFeed', function() {
            this._handleClearFeed(feedHeaderView, feedBodyView);
        });

        this.listenTo(feedHeaderView, 'toggleFavorites', feedBodyView.toggleFavorites.bind(feedBodyView));
        this.listenTo(feedHeaderView, 'collapseAll', feedBodyView.collapseAll.bind(feedBodyView));

        this.listenTo(feedBodyView, 'requestExpandToggle', function(expanded) {
            this._handleRequestExpandToggle(expanded, feedHeaderView, feedBodyView);
        });

        this.listenTo(feedBodyView, 'requestFavoriteToggle', function(favorited) {
            this._handleRequestFavoriteToggle(favorited, feedHeaderView, feedBodyView);
        });
    },

    _renderToolbar: function($markup) {
        return new ToolbarView({
            el: $markup.siblings('.toolbar'),
            model: this.model,
            webSocketManager: this.webSocketManager
        }).render();
    },

    _renderSettings: function($markup) {
        return new SettingsView({
            el: $markup.siblings('.settings-modal-container'),
            settingsModel: this.model
        }).render();
    },

    _renderFeedHeader: function($markup) {
        return new FeedHeaderView({
            el: $markup.find('.header'),
            webSocketManager: this.webSocketManager
        }).render();
    },

    _renderFeedBody: function($markup) {
        return new FeedBodyView({
            el: $markup.find('.body'),
            collection: this.collection
        }).render();
    },

    _handleRequestExpandToggle: function(expanded, feedHeaderView, feedBodyView) {
        if (!expanded && !feedBodyView.hasExpandedRequests()) {
            feedHeaderView.disableCollapseAll();
        }
        else if (expanded) {
            feedHeaderView.enableCollapseAll();
        }
    },

    _handleRequestFavoriteToggle: function(favorited, feedHeaderView, feedBodyView) {
        if (!favorited && !feedBodyView.hasFavoritedRequests()) {
            feedHeaderView.disableFavoritesFilter();
        }
        else if (favorited) {
            feedHeaderView.enableFavoritesFilter();
        }
    },

    _handleClearFeed: function(feedHeaderView, feedBodyView) {
        feedHeaderView.clear();
        feedBodyView.clear();
    }

});

module.exports = AppView;
