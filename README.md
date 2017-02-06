# meteor-fc-cli-rmv-problem
Minimal reproduction of a (possible) error happening within the Client side Remove operation of FileCollection

To reproduce the error, just do the following steps:

1. Run the application with the command "meteor", as normal;
2. Go to the browser, on <a href="http://localhost:3000/">http://localhost:3000/</a>, and Add more than one Event with a Banner image;
3. Choose any of the Events with a Banner image, and Edit it (Change or Remove the Banner);

<b>EXPECTED:</b> When Changing or Removing the Banner, the application should Remove the previous Banner from the FileCollection (Images), and only this file.
<br>
<b>RESULT:</b> ALL the files from FileCollection (Images) are Removed (it can be confirmed in the MongoDB shell, running "meteor mongo" and looking at the images.files Collection).

The lines where the Remove operation is executed are highlighted at lines 132 and 175 from the file client/components/eventsForm.js
