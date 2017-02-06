//function to clean event handlers from Images.resumable, so they don't get duplicate
cleanResumableEventHandlers = function (arrayOfEvents) {

  if (Images.resumable &&
     ((typeof(Images.resumable.events) !== 'undefined') &&
     (Array.isArray(Images.resumable.events) &&
     (Images.resumable.events.length > 0)))) {

    console.log('clean resumable event handlers!');

    let indexesToSplice = [];

    for (let i = 0, len = Images.resumable.events.length; i < len; i += 2) {

      console.log(Images.resumable.events[i]);

      if (arrayOfEvents.indexOf(Images.resumable.events[i]) >= 0) {
        indexesToSplice.push(i);
      } 
    }

    if (indexesToSplice.length > 0) {

      let newResumableEventsArray = [];

      for (let j = 0, len2 = Images.resumable.events.length; j < len2; j += 2) {

        if (indexesToSplice.indexOf(j) >= 0) {

          continue;
        }
        else {

          newResumableEventsArray.push(Images.resumable.events[i]);
          newResumableEventsArray.push(Images.resumable.events[i + 1]);
        }
      }

      Images.resumable.events = newResumableEventsArray;
    }
  }
}