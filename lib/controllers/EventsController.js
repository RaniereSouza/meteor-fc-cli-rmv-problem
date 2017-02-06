import { RouteController } from 'meteor/iron:router';

EventsController = RouteController.extend({
	index: function () {

		if (this.ready()) {

			this.render('eventsIndex', {
				data: {
					events: Events.find();
				}
			});
		}
	},
	insert: function () {

		if (this.ready()) {

			this.render('eventsInsert', {
				data: {
					formType: 'insert',
					collectionName: 'Events',
				}
			});
		}
	},
	update: function () {

		if (this.ready()) {

			this.render('eventsUpdate', {
				data: {
					formType: 'insert',
					collectionName: 'Events',
					model: Events.findOne();
				}
			});
		}
	},
});

export default EventsController;