import { RouteController } from 'meteor/iron:router';

EventsController = RouteController.extend({
	'index': function () {

		import '../../client/views/eventsIndex.js';

		if (this.ready()) {

			return this.render('eventsIndex', {
				data: {
					models: Events.find(),
				}
			});
		}
	},
	'insert': function () {

		import '../../client/views/eventsInsert.js';

		//console.log('bli');

		if (this.ready()) {

			return this.render('eventsInsert', {
				data: {
					formType: 'insert',
					collectionName: 'Events',
				}
			});
		}
	},
	'update': function () {

		import '../../client/views/eventsUpdate.js';

		//console.log('blu');

		if (this.ready()) {

			return this.render('eventsUpdate', {
				data: {
					formType: 'update',
					collectionName: 'Events',
					model: Events.findOne(),
				}
			});
		}
	},
});

export default EventsController;