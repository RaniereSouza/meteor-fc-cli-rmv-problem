import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

Meteor.startup(() => {
    // code to run on server at startup
    /*WebApp.rawConnectHandlers.use('/_resumable', function (req, res, next) {

  	    console.log('_resumable passou pelo connectHandlers!');

  		res.setHeader("Access-Control-Allow-Origin", "*");

  		return next();
    });*/

    /*WebApp.rawConnectHandlers.use(function (req, res, next) {

  	    console.log('passou pelo connectHandlers!');
  		console.log('req.headers["user-agent"]:', req.headers['user-agent']);
  		console.log('req.method:', req.method);
  		console.log('req.url:', '"' + req.url + '"');

  		res.setHeader("Access-Control-Allow-Origin", "*");

  		return next();
    });*/
});
