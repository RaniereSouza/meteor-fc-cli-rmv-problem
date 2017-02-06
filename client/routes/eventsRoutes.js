import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import EventsController from '../../lib/controllers/EventsController.js';

Router.route('/', {
	name: 'eventsIndex',
	controller: EventsController,
	action: 'index',
	subscriptions: function () {
		return Meteor.subscribe('events.index');
	},
});

Router.route('/insert', {
	name: 'eventsInsert',
	controller: EventsController,
	action: 'insert',
	/*subscriptions: function () {
		
	},*/
});

Router.route('/update/:_id', {
	name: 'eventsUpdate',
	controller: EventsController,
	action: 'update',
	subscriptions: function () {
		return Meteor.subscribe('events.update', this.getId());
	},
});