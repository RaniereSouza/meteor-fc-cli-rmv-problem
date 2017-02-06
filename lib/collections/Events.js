import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Events = new Mongo.Collection('events');

var eventsSchema = new SimpleSchema({
	name: {
		type: String,
		label: "Name",
	},
	date: {
		type: Date,
		label: "Date & Time",
	},
	description: {
		type: String,
		label: "Description",
		optional: true,
	},
	imageId: {
		type: String,
		optional: true,
	}
});

Events.attachSchema(eventsSchema);

Events.allow({
	insert: function (userId, doc) {
		return true;
	},
	update: function (userId, doc) {
		return true;
	},
	remove: function (userId, doc) {
		return true;
	},
});

Events.helpers({
	image: function () {

		if (this.imageId) {

			return {
				url: Images.baseURL + "/id/" + this.imageId /*+ "?cache=172800"*/
			}; 
		}

		return false;
	},
});

export default Events;