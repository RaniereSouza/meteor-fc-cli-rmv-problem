import { Meteor } from 'meteor/meteor';
import Events from '../lib/collections/Events.js';



Meteor.publishComposite('events.index', function () {

	return {
		find: function () {

			return Events.find();
		},
		children: [],
	}
});



Meteor.publishComposite('events.update', function (eventId) {

	return {
		find: function () {

			return Events.find(eventId);
		},
		children: [],
	}
});