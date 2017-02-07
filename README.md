# meteor-fc-cli-rmv-problem
Minimal reproduction of a (possible) error happening within the Client side <code>.remove()</code> operation of <code>FileCollection</code> Meteor package

(refers to <a href="https://github.com/vsivsi/meteor-file-collection/issues/152">Issue \#152</a> from the Meteor Atmosphere package <a href="https://github.com/vsivsi/meteor-file-collection">vsivsi:file-collection</a>)

To reproduce the error, just do the following steps:

1. Clone this repository to your machine;
2. Run the application with the command <code>meteor</code>, as normal;
3. Go to the browser, on <a href="http://localhost:3000/">http://localhost:3000/</a>, and Add more than one Event with a Banner image;
4. Choose any of the Events with a Banner image, and Edit it (Change or Remove the Banner);

<b>EXPECTED:</b> When Changing or Removing the Banner, the application should Remove the previous Banner from the <code>FileCollection</code> (Images), and only this file.
<br>
<b>RESULT:</b> ALL the files from <code>FileCollection</code> (Images) are Removed (it can be confirmed in the MongoDB shell, running <code>meteor mongo</code> and looking at the <code>images.files</code> Collection).

The lines where the <code>.remove()</code> operation is executed are highlighted at lines <a href="https://github.com/RaniereSouza/meteor-fc-cli-rmv-problem/blob/master/client/components/eventsForm.js#L144">144</a> and <a href="https://github.com/RaniereSouza/meteor-fc-cli-rmv-problem/blob/master/client/components/eventsForm.js#L191">191</a> from the file <a href="https://github.com/RaniereSouza/meteor-fc-cli-rmv-problem/blob/master/client/components/eventsForm.js">client/components/eventsForm.js</a>

>[[<b>UPDATE:</b> The error was tracked down by <a href="https://github.com/vsivsi">@vsivsi</a> as a problem with <b>the combined use of the package <code>vsivsi:file-collection</code> and the package <code>dburles:collection-helpers</code></b> (classifying it as an undesired <b>Feature Interaction</b> problem - look <a href="https://en.wikipedia.org/wiki/Feature_interaction_problem">here</a> for more details about what Feature Interactions are). Basically, the <code>dburles:collection-helpers</code> overwrite some basic <code>Mongo.Collection</code> methods, and it breaks the <code>.remove()</code> operation on the <code>FileCollection</code>. See <a href="https://github.com/vsivsi/meteor-file-collection/issues/152">this Issues page</a> for a more detailed explanation.]]
