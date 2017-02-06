import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import { AutoForm } from 'meteor/aldeed:autoform';
import { Router } from 'meteor/iron:router';
import { sweetAlert } from 'meteor/kevohagan:sweetalert';

import Images from '../../lib/collections/Images.js';

import './eventsForm.html';

var imgToUpload,
	previousImageId,
	currentTemplateInstance;

AutoForm.hooks({
	eventsForm: {
		before: {
			insert: function (doc) {

				let context = this;

				if (imgToUpload) {

					console.log('try to insert new image');

					Images.insert({
						_id: new Mongo.ObjectID(imgToUpload.uniqueIdentifier),
						filename: 'images-' + imgToUpload.uniqueIdentifier,
						contentType: imgToUpload.file.type,
						//aliases: [null],
						//metadata: null,
					}, function (err, _id) {

						if (err) {

							console.log('err1');

							//remove empty file from GridFS
							Images.remove(_id);

							sweetAlert('Warning!', 'Image upload failed\n' + err.message, 'error');

							context.result(false);
						}
						else {

							console.log(_id);

							Images.resumable.on('fileSuccess', function fileSuccessFromEventInsert (file) {

								console.log('done!');

								//instance.$('#cropped-banner-preview').html('');

								imgToUpload = undefined;

								doc['imageId'] = _id._str;

								context.result(doc);	
							});
							
							Images.resumable.on('fileError', function fileErrorFromEventInsert (file, message) {

								console.log('err2');

								//remove empty file from GridFS
								Images.remove(_id);

								sweetAlert('Warning!', 'Image upload failed\n' + message, 'error');

								context.result(false);	
							});

							console.log('Images.resumable.events:', Images.resumable.events);

							Images.resumable.upload();
						}
					});
				}
				else {

					context.result(doc);
				}
			},
			update: function (doc) {

				let context = this,
					instance = currentTemplateInstance;

				if (imgToUpload) {

					console.log('try to insert new image');

					Images.insert({
						_id: new Mongo.ObjectID(imgToUpload.uniqueIdentifier),
						filename: 'images-' + imgToUpload.uniqueIdentifier,
						contentType: imgToUpload.file.type,
						//aliases: [null],
						//metadata: null,
					}, function (err, _id) {

						if (err) {

							console.log('err1');

							//remove empty file from GridFS
							Images.remove(_id);

							sweetAlert('Warning!', 'Image upload failed\n' + err.message, 'error');

							context.result(false);
						}
						else {

							console.log(_id);

							//add event handler for succesful upload of files in resumable queue
							Images.resumable.on('fileSuccess', function fileSuccessFromEventUpdate (file) {

								console.log('done!');

								//instance.$('#cropped-banner-preview').html('');

								imgToUpload = undefined;

								//in case there is a previous image in this Event, remove it
								if (typeof(previousImageId) !== 'undefined') {

									//build the ObjectID from the foreign key previously saved in Event
								   	let previousImageObjectID = new Mongo.ObjectID(previousImageId);

								   	//------ problem occurs HERE, when I try to remove JUST ONE image by _id (ObjectID), and it ends up removing everything ------//
									Images.remove(previousImageObjectID);
								}

								doc.$set['imageId'] = _id._str;

								if (doc.$unset) {

									delete doc.$unset.imageId;
								}

								context.result(doc);	
							});
							
							//add event handler for error during upload of files in resumable queue
							Images.resumable.on('fileError', function fileErrorFromEventUpdate (file, message) {

								console.log('err2');

								//remove empty file from GridFS
								Images.remove(_id);

								sweetAlert('Warning!', 'Image upload failed\n' + message, 'error');

								context.result(false);	
							});

							console.log('Images.resumable.events:', Images.resumable.events);

							Images.resumable.upload();
						}
					});
				}
				else {

					//in case there is a previous image in this Event, remove it (only if preview is removed)
					if (typeof(previousImageId) !== 'undefined') {

						if (instance.$('#cropped-banner-preview').html() === '') {

							//build the ObjectID from the foreign key previously saved in Event
							let previousImageObjectID = new Mongo.ObjectID(previousImageId);

							//------ problem occurs HERE, when I try to remove JUST ONE image by _id (ObjectID), and it ends up removing everything ------//
							Images.remove(previousImageObjectID);

							doc.$set['imageId'] = '';
						}
					}

					context.result(doc);
				}
			},
		},
		onSuccess: function (formType, result) {

			Router.go('eventsIndex');
		}
	}
});

Template.eventsForm.onCreated(function () {

	currentTemplateInstance = this;

	Images.resumable.cancel();
	//cleaning event handlers from Images.resumable just so they don't get duplicated
	cleanResumableEventHandlers(['fileadded', 'filesuccess', 'fileerror']);
});

Template.eventsForm.onRendered(function () {

	let instance = this;
  	
  	//add event handler to new file in resumable queue; just pass it to imgToUpload global
    Images.resumable.on('fileAdded', function fileAddedFromEvent (file) {

		imgToUpload = file;

		console.log('imgToUpload:', imgToUpload);
	});

    //check in update if there's a previous imageId in the Event and pass it to previousImageId global
	if ((typeof(instance.data.model) !== 'undefined') &&
	   instance.data.model.imageId) {

	 	previousImageId = instance.data.model.imageId;

	 	//console.log(previous_imageId);

	 	//get existing image url and render in '#cropped-banner-preview'
	 	let imgUrl = instance.data.model.image().url;

		//console.log(imgUrl);

		if ((typeof(imgUrl) !== 'undefined') && imgUrl) {

			instance.$('#cropped-banner-preview').html(
				'<img src="' +
				imgUrl +
				'">'
			);

			instance.$('#cropped-banner-remove').removeClass('hidden');
			instance.$('#cropped-banner-add').text('Change Banner');
		}
	}
});

Template.eventsForm.onDestroyed(function () {
  
});

Template.eventsForm.helpers({
  
});

Template.eventsForm.events({
   'click #cropped-banner-add': function (e, t) {

		e.preventDefault();

		//console.log('choosing and adding a banner');

		//t.$('#cropBannerModal').modal('show');
	},
	'change #cropBannerModal #partner-image-upload': function (e, t) {

		//console.log(e);

		e.preventDefault();
		$(".canvas > img").remove();
		//console.log('selected some file!');

		let files =  e.target.files;

		if (files.length > 0) {

			let reader = new FileReader(),
				img = new Image();

			reader.onload = function (e) {

				//console.log('finished reading file!');

				img.onload = function () {

					//console.log('finished loading image from file source!');

					t.$('#cropBannerModal .partner-image-btn').addClass('hidden');
					t.$('#cropBannerModal .partner-change-img-btn, ' +
						'#cropBannerModal .partner-crop-img-btn, ' +
						'#cropBannerModal .btn-zoom-plus-modal-partner, ' +
						'#cropBannerModal .btn-zoom-minus-modal-partner').removeClass('hidden');
					
					t.$(".canvas").append(img);
					
					t.$(".canvas > img").cropper({
						viewMode: 0,
						aspectRatio: 1/1,
						scalable: false,
						cropBoxMovable:false,
						cropBoxResizable: false,
						minCropBoxWidth:500,
						minCropBoxHeight:500,
						toggleDragModeOnDblclick:false,
						built: function () {
				            t.$(".canvas > img").cropper('setDragMode', 'move');
				            t.$(".canvas > img").cropper({
								toggleDragModeOnDblclick:false
							});
				        }
					});					 
				}

				img.src = e.target.result;
			}

			console.log("array of files:", files);

			reader.readAsDataURL(files[0]);
		}
	},
	'click #cropBannerModal .partner-change-img-btn': function (e, t) {

		e.preventDefault();

		//console.log('pick another image file...');

		//console.log(this);

		let canvas = t.$(".canvas > img");
			
		t.$(canvas).attr('src','');
		$(canvas).cropper('destroy');


		t.$('#cropBannerModal .partner-change-img-btn, ' +
			'#cropBannerModal .partner-crop-img-btn, ' +
			'#cropBannerModal .partner-upload-img-btn, ' +
			'#cropBannerModal #partner-crop-img-preview, ' +
			'#cropBannerModal .partner-crop-img-label, '+
			'#cropBannerModal .btn-zoom-plus-modal-partner, ' +
			'#cropBannerModal .btn-zoom-minus-modal-partner').addClass('hidden');
		t.$('#cropBannerModal .partner-image-btn').removeClass('hidden');
		t.$('#cropBannerModal #partner-crop-img-preview').html('');
	},
	'click #cropBannerModal .partner-crop-img-btn': function (e, t) {

		e.preventDefault();

		//console.log('try to generate cropped image!');

		let canvas = t.$(".canvas > img"),
			//context = canvas.getContext("2d"),
			crop = $(".canvas > img").cropper('getCroppedCanvas', {width: 500, height: 500, fillColor: '#ffffff'});
			// crop = $(canvas).cropper('getCroppedCanvas');
			// data = crop.toDataURL();

		//console.log(crop);

		t.$('#cropped-banner-preview').html(crop);

		//clean upload queue if there was another image before
		Images.resumable.cancel();

		//canvas to blob here; just add the blob to resumable queue
		crop.toBlob(function (blob) {

			//imgToUpload = blob;
			Images.resumable.addFile(blob);

			//console.log("imgToUpload inside ")
			//console.log("imgToUpload:", imgToUpload);
		});
		
		t.$('#cropped-banner-remove').removeClass('hidden');
		t.$('#cropped-banner-add').text('Change Banner');

		t.$('#cropBannerModal').modal('hide');
	},
	'click #cropped-banner-remove': function (e, t) {

		e.preventDefault();

		t.$('#cropped-banner-preview').html('');
		t.$('#cropped-banner-add').text('Add Banner');
		$(e.target).addClass('hidden');

		imgToUpload = undefined;
		//clean upload queue if there was another image before
		Images.resumable.cancel();
	},
	'click .btn-zoom-plus-modal-partner': function () {
		$(".canvas > img").cropper('zoom', 0.1);
	},
	'click .btn-zoom-minus-modal-partner': function () {
		$(".canvas > img").cropper('zoom', -0.1);
	},
});
