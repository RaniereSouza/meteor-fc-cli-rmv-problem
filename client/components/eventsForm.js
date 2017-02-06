import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import { AutoForm } from 'meteor/aldeed:autoform';
import { Router } from 'meteor/iron:router';
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

							sweetAlert('Warning!', 'Image upload failed', 'error');

							context.result(false);
						}
						else {

							//Images.resumable.off('fileSuccess');
							//Images.resumable.off('fileError');

							//console.log("fileObj._id");
							//console.log(fileObj._id);
							console.log(_id);

							Images.resumable.on('fileSuccess', function fileSuccessFromEventInsert (file) {

								console.log('done!');

								//instance.$('#cropped-banner-preview').html('');

								imgToUpload = undefined;

								newDoc['imageId'] = _id._str;

								context.result(newDoc);	
							});
							
							Images.resumable.on('fileError', function fileErrorFromEventInsert (file) {

								console.log('err2');

								//remove empty file from GridFS
								Images.remove(_id);

								sweetAlert('Warning!', 'Image upload failed', 'error');

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

							sweetAlert('Warning!', 'Image upload failed', 'error');

							context.result(false);
						}
						else {

							//Images.resumable.off('fileSuccess');
							//Images.resumable.off('fileError');

							//console.log("fileObj._id");
							//console.log(fileObj._id);
							console.log(_id);

							Images.resumable.on('fileSuccess', function fileSuccessFromEventUpdate (file) {

								console.log('done!');

								//instance.$('#cropped-banner-preview').html('');

								imgToUpload = undefined;

								if (typeof(previousImageId) !== 'undefined') {

								   	let previousImageObjectID = new Mongo.ObjectID(previousImageId);

									Images.remove(previousImageObjectID);
								}

								newDoc.$set['imageId'] = _id._str;

								if (newDoc.$unset) {

									delete newDoc.$unset.imageId;
								}

								context.result(newDoc);	
							});
							
							Images.resumable.on('fileError', function fileErrorFromEventUpdate (file) {

								console.log('err2');

								//remove arquivo vazio do GridFS
								Images.remove(_id);

								sweetAlert('Warning!', 'Image upload failed', 'error');

								context.result(false);	
							});

							console.log('Images.resumable.events:', Images.resumable.events);

							Images.resumable.upload();
						}
					});
				}
				else {

					if (typeof(previous_imageId) !== 'undefined') {

						if (instance.$('#cropped-banner-preview').html() === '') {

							let previousImageObjectID = new Mongo.ObjectID(previousImageId);

							Images.remove(previousImageObjectID);

							newDoc.$set['imageId'] = '';
						}
					}

					context.result(newDoc);
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
	cleanResumableEventHandlers(['fileadded', 'filesuccess', 'fileerror']);
});

Template.eventsForm.onRendered(function () {
  
    Images.resumable.on('fileAdded', function fileAddedFromEvent (file) {

		imgToUpload = file;

		console.log('imgToUpload:', imgToUpload);
	});
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

		//canvas to blob here
		crop.toBlob(function (blob) {

			//imgToUpload = blob;
			Images.resumable.addFile(blob);

			//console.log("imgToUpload inside ")
			//console.log("imgToUpload:", imgToUpload);
		});
		
		t.$('#cropped-banner-remove').removeClass('hidden');
		t.$('#cropped-banner-add').text('Alterar Banner');

		t.$('#cropBannerModal').modal('hide');
		// t.$('#cropBannerModal .partner-crop-img-label, ' +
		// 	'#cropBannerModal #partner-crop-img-preview, ' +
		// 	'#cropBannerModal .partner-upload-img-btn').removeClass('hidden');
	},
	'click #cropped-banner-remove': function (e, t) {

		e.preventDefault();

		t.$('#cropped-banner-preview').html('');
		t.$('#cropped-banner-add').text('Adicionar Banner');
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
