'use strict';
// Load modules

const Backbone = require('backbone');
const ChannelSelectorView = require('../../../source/js/views/channelSelector');


// Declare internals

const internals = {};


internals.generateView = function (options) {

    options = options || {};
    options.model = options.model || new Backbone.Model();

    return new ChannelSelectorView(options);
};


describe('ChannelSelectorView', function () {

    describe('#template', function () {

        it('returns html', function () {

            const view = internals.generateView();

            expect(view.template()).to.match(/<[a-z][\s\S]*>/); // html string
        });

    });

    describe('#events', function () {

        context('with a click on a button', function () {

            it('sets the settings model channel property', function () {

                const $el = $('<div><button data-channel="foobar"></div>');
                const view = internals.generateView({ el: $el });

                view.$('button').click();

                expect(view.model.get('channel')).to.equal('foobar');
            });

        });

    });

    describe('#initialize', function () {

        context('with a change to the settings model clientId', function () {

            it('updates the clientId button html', function () {

                const $el = $('<div><button class="client-id" data-channel="foobar"><span>foobar</span></div>');
                const view = internals.generateView({ el: $el });

                view.model.set('clientId', 'barbaz');

                expect(view.$('button').attr('data-channel')).to.equal('barbaz');
                expect(view.$('button span').html()).to.equal('barbaz');
            });

        });

        context('with a change to the settings model channel', function () {

            it('applies the active class to only the button for the new channel', function () {

                const $el = $([
                    '<div><button class="client-id active" data-channel="foobar"><span>foobar</span></div>',
                    '<div><button class="all" data-channel="*"></div>'
                ].join(''));
                const view = internals.generateView({ el: $el });

                view.model.set('channel', '*');

                expect(view.$('button.client-id').hasClass('active')).to.be.false;
                expect(view.$('button.all').hasClass('active')).to.be.true;
            });

        });

    });

    describe('#render', function () {

        it('has the expected markup', function () {

            const view = internals.generateView({
                model: new Backbone.Model({ clientId: 'foobar', channel: '*' })
            });

            view.render();

            expect(view.$('button.client-id').attr('data-channel')).to.equal('foobar');
            expect(view.$('button.client-id span').html()).to.equal('foobar');
            expect(view.$('button.all').hasClass('active')).to.be.true;
        });

    });

});
