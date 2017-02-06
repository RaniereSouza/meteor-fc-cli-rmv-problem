import { Template } from 'meteor/templating';

import './eventsIndex.html';

Template.eventsIndex.onCreated(function () {
  
});

Template.eventsIndex.onRendered(function () {
  
});

Template.eventsIndex.onDestroyed(function () {
  
});

Template.eventsIndex.helpers({
  formatDateTime: function (date) {
  	return moment(date).format('LLL');
  }
});

Template.eventsIndex.events({
  
});
