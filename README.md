# meteor-fc-cli-rmv-problem
Minimal reproduction of a (possible) error happening within the Client side '.remove()' operation of 'FileCollection' Meteor package

(refers to <a href="https://github.com/vsivsi/meteor-file-collection/issues/152">Issue \#152</a> from the Meteor Atmosphere package <a href="https://github.com/vsivsi/meteor-file-collection">vsivsi:file-collection</a>)

To reproduce the error, just do the following steps:

1. Clone this repository to your machine;
2. Run the application with the command "meteor", as normal;
3. Go to the browser, on <a href="http://localhost:3000/">http://localhost:3000/</a>, and Add more than one Event with a Banner image;
4. Choose any of the Events with a Banner image, and Edit it (Change or Remove the Banner);

<b>EXPECTED:</b> When Changing or Removing the Banner, the application should Remove the previous Banner from the FileCollection (Images), and only this file.
<br>
<b>RESULT:</b> ALL the files from FileCollection (Images) are Removed (it can be confirmed in the MongoDB shell, running "meteor mongo" and looking at the images.files Collection).

The lines where the '.remove()' operation is executed are highlighted at lines <a href="https://github.com/RaniereSouza/meteor-fc-cli-rmv-problem/blob/master/client/components/eventsForm.js#L144">144</a> and <a href="https://github.com/RaniereSouza/meteor-fc-cli-rmv-problem/blob/master/client/components/eventsForm.js#L191">191</a> from the file <a href="https://github.com/RaniereSouza/meteor-fc-cli-rmv-problem/blob/master/client/components/eventsForm.js">client/components/eventsForm.js</a>

[<b>UPDATE:</b> The error was tracked down by <a href="https://github.com/vsivsi">@vsivsi</a> as a problem with <b>the combined use of the package 'vsivsi:file-collection' and the package 'dburles:collection-helpers'</b> (classifying it as an undesired <b>Feature Interaction</b> problem - look <a href="https://en.wikipedia.org/wiki/Feature_interaction_problem">here</a> for more details about what Feature Interactions are). Basically, the 'dburles:collection-helpers' overwrite some basic 'Mongo.Collection' methods, and it breaks the '.remove()' operation on the 'FileCollection'. See <a href="https://github.com/vsivsi/meteor-file-collection/issues/152">this Issues page</a> for a more detailed explanation.]
