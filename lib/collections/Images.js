import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { FileCollection } from 'meteor/vsivsi:file-collection';

Images = new FileCollection('images', {
	baseURL: '/gridfs/images', //default: '/gridfs/[collection name]'
	resumable: true,
	chunkSize: 1024 * 1024, //1 MB
	maxUploadSize: 1024 * 1024, //1 MB
	locks: {
		timeout: 360,
		pollingInterval: 5,
		lockExpiration: 90,
	},
	http: [
		{
			method: 'get',
			path: '/id/:_id',
			lookup: function (params, query) {

				//console.log(Mongo);
				//console.log("params._id._str:", params._id._str);

				return {_id: new Mongo.ObjectID(params._id._str)};
			},
		},
	],
});

if (Meteor.isServer) {

	Images.allow({
		insert: function(userId, doc) {
			return true;
		},
		/*update: function(userId, doc) {
			return true;
		},*/
		remove: function(userId, doc) {
			return true;
		},
		/*download: function(userId, doc) {
			return true;
		},*/
		read: function(userId, doc) {
			return true;
		},
		write: function(userId, doc, fields) {
			return true;
		},
	});
}

//------ Problem tracked for when assigning a helper to a FileCollection, let's just not do that to Images ------//
/*Images.helpers({
	url: function () {
		return Images.baseURL + '/id/' + this._id + '?cache=172800';
	},
});*/

export default Images;