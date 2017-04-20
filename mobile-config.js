// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.meteor.cordova.fcCliRmvProblem',
  name: 'meteor-fc-cli-rmv-problem',
  description: 'Sample app',
  author: 'Raniere Souza Santos',
  email: 'raniere.souza.cc@gmail.com',
  website: 'https://github.com/RaniereSouza/meteor-fc-cli-rmv-problem',
  version: '1.0.0',
  buildNumber: '1'
});

// Set up resources such as icons and launch screens.
/*App.icons({
  'android_mdpi'    : 'mobile-configs/icons/android_mdpi_48.png',
  'android_hdpi'    : 'mobile-configs/icons/android_hdpi_72.png',
  'android_xhdpi'   : 'mobile-configs/icons/android_xhdpi_96.png',
  'android_xxhdpi'  : 'mobile-configs/icons/android_xxhdpi_144.png',
  'android_xxxhdpi' : 'mobile-configs/icons/android_xxxhdpi_192.png',

  'ios_spotlight_2x': 'mobile-configs/icons/ios_80.png',
  'ios_settings_3x' : 'mobile-configs/icons/ios_87.png',
  'iphone_2x'       : 'mobile-configs/icons/ios_120.png',
  'ipad_2x'         : 'mobile-configs/icons/ios_152.png',
  'iphone_3x'       : 'mobile-configs/icons/ios_180.png'
  // ... more screen sizes and platforms ...
});*/

/*App.launchScreens({
  'android_mdpi_landscape': 'mobile-configs/splash/android_mdpi_480_320.png',
  'android_mdpi_portrait': 'mobile-configs/splash/android_mdpi_320_480.png',
  'android_hdpi_landscape': 'mobile-configs/splash/android_hdpi_800_480.png',
  'android_hdpi_portrait': 'mobile-configs/splash/android_hdpi_480_800.png',
  'android_xhdpi_portrait': 'mobile-configs/splash/android_xhdpi_720_1280.png',

  'iphone_2x': 'mobile-configs/splash/ios_640_960.png',
  'iphone5': 'mobile-configs/splash/ios_640_1136.png',
  'iphone6': 'mobile-configs/splash/ios_750_1334.png',
  'iphone6p_portrait': 'mobile-configs/splash/ios_1242_2208.png',
  // ... more screen sizes and platforms ...
});*/

// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '#7FFFD4');
//App.setPreference('HideKeyboardFormAccessoryBar', true);
//App.setPreference('SplashScreen', 'screen');
//App.setPreference('SplashScreenDelay', '80000');
App.setPreference('StatusBarStyle', 'default');
// App.setPreference('StatusBarOverlaysWebView', 'false');
App.setPreference('StatusBarBackgroundColor', '#7FFFD4');

App.accessRule('*.google.com/*');
App.accessRule('*.googleapis.com/*');
App.accessRule('*.gstatic.com/*');
App.accessRule('blob:*');
App.accessRule('*');