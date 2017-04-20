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
		{
		    method: 'post',  // Enable a POST endpoint
            path: '/_resumable/:id',  // this will be at route "/gridfs/images/_resumable"
            lookup: function (params, query) {  // uses express style url params
                return { };       // a query mapping url to images
            },
            handler: function (req, res, next) {
            	console.log('POST handler for _resumable:', '"' + req.url + '"');
                if (req.headers && req.headers.origin) {
                    res.setHeader('Access-Control-Allow-Origin', req.headers.origin); // For Cordova
                    res.setHeader('Access-Control-Allow-Credentials', true);
                }
                next();
            }
        },
		{
			method: 'head',  // Enable an HEAD endpoint (for CORS)
	        path: '/_resumable/:id',  // this will be at route "/gridfs/images/_resumable/"
	        lookup: function (params, query) {  // uses express style url params
	            return { };       // a query mapping url to images
	        },
	        handler: function (req, res, next) {  // Custom express.js handler for HEAD
	            console.log('HEAD handler for _resumable:', req.headers['user-agent']);
	            res.writeHead(200, {
	                'Content-Type': 'text/plain',
	                'Access-Control-Allow-Origin': req.headers.origin,  // For Cordova
	                'Access-Control-Allow-Credentials': true,
	                'Access-Control-Allow-Headers': 'x-auth-token, user-agent',
	                'Access-Control-Allow-Methods': 'GET, POST, HEAD, OPTIONS'
	            });
	            next();
	        }
	    },
		{
			method: 'options',  // Enable an OPTIONS endpoint (for CORS)
	        path: '/_resumable/:id',  // this will be at route "/gridfs/images/_resumable/"
	        lookup: function (params, query) {  // uses express style url params
	            return { };       // a query mapping url to images
	        },
	        handler: function (req, res, next) {  // Custom express.js handler for OPTIONS
	        	console.log('OPTIONS handler for _resumable:', req.headers.origin);
	            res.writeHead(200, {
	                'Content-Type': 'text/plain',
	                'Access-Control-Allow-Origin': req.headers.origin,  // For Cordova
	                'Access-Control-Allow-Credentials': true,
	                'Access-Control-Allow-Headers': 'x-auth-token, user-agent',
	                'Access-Control-Allow-Methods': 'GET, POST, HEAD, OPTIONS'
	            });
	            res.end();
	            return;
	        }
	    }
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