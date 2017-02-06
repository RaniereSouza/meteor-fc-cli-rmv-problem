import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';

import EventsController from '../../lib/controllers/EventsController.js';

import '../layouts/mainLayout.js';

Router.route('/', {
	name: 'eventsIndex',
	layoutTemplate: 'mainLayout',
	controller: EventsController,
	action: 'index',
	subscriptions: function () {
		return Meteor.subscribe('events.index');
	},
});

Router.route('/events/insert', {
	name: 'eventsInsert',
	layoutTemplate: 'mainLayout',
	controller: EventsController,
	action: 'insert',
	/*subscriptions: function () {
		
	},*/
});

Router.route('/events/update/:_id?', {
	name: 'eventsUpdate',
	layoutTemplate: 'mainLayout',
	controller: EventsController,
	action: 'update',
	subscriptions: function () {

		let instance = this;

		//console.log("Router instance:", instance);

		return Meteor.subscribe('events.update', instance.params._id);
	},
});