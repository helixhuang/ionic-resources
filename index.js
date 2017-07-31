var fs     = require('fs-extra');
var path   = require('path');
var gm     = require('gm');
var colors = require('colors');
var _      = require('underscore');
var Q      = require('q');

/**
 * @var {Object} settings - names of the config file and of the icon image
 * TODO: add option to get these values as CLI params
 */
var settings = {};
settings.ICON_FILE   = 'resources/icon.png';
settings.SPLASH_FILE   = 'resources/splash.png';

/**
 * Check which platforms are added to the project and return their icon names and sizes
 *
 * @param  {String} projectName
 * @return {Promise} resolves with an array of platforms
 */
var getPlatforms = function () {
  var deferred = Q.defer();
  var platforms = [];
  platforms.push({
    name : 'ios',
    // TODO: use async fs.exists
    isAdded : fs.existsSync('platforms/ios'),
    iconsPath : 'resources/ios/icon/',
    icons : [
      { name : 'icon-40.png',       size : 40  },
      { name : 'icon-40@2x.png',    size : 80  },
      { name : 'icon-50.png',       size : 50  },
      { name : 'icon-50@2x.png',    size : 100 },
      { name : 'icon-50@3x.png',    size : 120 },
      { name : 'icon-60.png',       size : 60  },
      { name : 'icon-60@2x.png',    size : 120 },
      { name : 'icon-60@3x.png',    size : 180 },
      { name : 'icon-72.png',       size : 72  },
      { name : 'icon-72@2x.png',    size : 144 },
      { name : 'icon-76.png',       size : 76  },
      { name : 'icon-76@2x.png',    size : 152 },
      { name : 'icon-small.png',    size : 29  },
      { name : 'icon-small@2x.png', size : 58  },
      { name : 'icon-small@3x.png', size : 87  },
      { name : 'icon.png',          size : 57  },
      { name : 'icon@2x.png',       size : 114 },
      { name : 'icon-83.5@2x.png',  size : 167 }
    ],
    splashPath : 'resources/ios/splash/',
    splashes : [
      // iPhone
      { name: 'Default~iphone.png',            width: 320,  height: 480  },
      { name: 'Default@2x~iphone.png',         width: 640,  height: 960  },
      { name: 'Default-568h@2x~iphone.png',    width: 640,  height: 1136 },
      { name: 'Default-667h.png',              width: 750,  height: 1334 },
      { name: 'Default-736h.png',              width: 1242, height: 2208 },
      { name: 'Default-Landscape-736h.png',    width: 2208, height: 1242 },
      // iPad
      { name: 'Default-Portrait~ipad.png',     width: 768,  height: 1024 },
      { name: 'Default-Portrait@2x~ipad.png',  width: 1536, height: 2048 },
      { name: 'Default-Portrait@~ipadpro.png', width: 2048, height: 2732 },
      { name: 'Default-Landscape~ipad.png',    width: 1024, height: 768  },
      { name: 'Default-Landscape@2x~ipad.png', width: 2048, height: 1536 },
      { name: 'Default-Landscape@~ipadpro.png', width: 2732, height: 2048 }
    ]
  });
  platforms.push({
    name : 'android',
    isAdded : fs.existsSync('platforms/android'),
    iconsPath : 'resources/android/icon/',
    icons : [
      { name : 'drawable-icon.png',       size : 96 },
      { name : 'drawable-hdpi-icon.png',  size : 72 },
      { name : 'drawable-ldpi-icon.png',  size : 36 },
      { name : 'drawable-mdpi-icon.png',  size : 48 },
      { name : 'drawable-xhdpi-icon.png', size : 96 },
      { name : 'drawable-xxhdpi-icon.png', size : 144 },
      { name : 'drawable-xxxhdpi-icon.png', size : 192 }
    ],
    splashPath : 'resources/android/splash/',
    splashes : [
      // Landscape
      { name: 'drawable-land-ldpi-screen.png',  width: 320,  height: 200  },
      { name: 'drawable-land-mdpi-screen.png',  width: 480,  height: 320  },
      { name: 'drawable-land-hdpi-screen.png',  width: 800,  height: 480  },
      { name: 'drawable-land-xhdpi-screen.png', width: 1280, height: 720  },
      { name: 'drawable-land-xxhdpi-screen.png', width: 1600, height: 960  },
      { name: 'drawable-land-xxxhdpi-screen.png', width: 1920, height: 1280  },
      // Portrait
      { name: 'drawable-port-ldpi-screen.png',  width: 200,  height: 320  },
      { name: 'drawable-port-mdpi-screen.png',  width: 320,  height: 480  },
      { name: 'drawable-port-hdpi-screen.png',  width: 480,  height: 800  },
      { name: 'drawable-port-xhdpi-screen.png', width: 720,  height: 1280 },
      { name: 'drawable-port-xxhdpi-screen.png', width: 960, height: 1600  },
      { name: 'drawable-port-xxxhdpi-screen.png', width: 1280, height: 1920  }
    ]
  });
  platforms.push({
    name : 'windows',
    isAdded : fs.existsSync('platforms/windows'),
    iconsPath : 'resources/windows/icon/',
    icons : [
      { name : 'StoreLogo.scale-100.png', size : 50  },
      { name : 'StoreLogo.scale-125.png', size : 63  },
      { name : 'StoreLogo.scale-150.png', size : 75  },
      { name : 'StoreLogo.scale-200.png', size : 100 },
      { name : 'StoreLogo.scale-400.png', size : 200 },

      { name : 'Square44x44Logo.scale-100.png', size : 44  },
      { name : 'Square44x44Logo.scale-125.png', size : 55  },
      { name : 'Square44x44Logo.scale-150.png', size : 66  },
      { name : 'Square44x44Logo.scale-200.png', size : 88  },
      { name : 'Square44x44Logo.scale-400.png', size : 176 },

      { name : 'Square71x71Logo.scale-100.png', size : 71  },
      { name : 'Square71x71Logo.scale-125.png', size : 89  },
      { name : 'Square71x71Logo.scale-150.png', size : 107 },
      { name : 'Square71x71Logo.scale-200.png', size : 142 },
      { name : 'Square71x71Logo.scale-400.png', size : 284 },

      { name : 'Square150x150Logo.scale-100.png', size : 150 },
      { name : 'Square150x150Logo.scale-125.png', size : 188 },
      { name : 'Square150x150Logo.scale-150.png', size : 225 },
      { name : 'Square150x150Logo.scale-200.png', size : 300 },
      { name : 'Square150x150Logo.scale-400.png', size : 600 },

      { name : 'Square310x310Logo.scale-100.png', size : 310  },
      { name : 'Square310x310Logo.scale-125.png', size : 388  },
      { name : 'Square310x310Logo.scale-150.png', size : 465  },
      { name : 'Square310x310Logo.scale-200.png', size : 620  },
      { name : 'Square310x310Logo.scale-400.png', size : 1240 },

      { name : 'Wide310x150Logo.scale-100.png', size : 310, height : 150  },
      { name : 'Wide310x150Logo.scale-125.png', size : 388, height : 188  },
      { name : 'Wide310x150Logo.scale-150.png', size : 465, height : 225  },
      { name : 'Wide310x150Logo.scale-200.png', size : 620, height : 300  },
      { name : 'Wide310x150Logo.scale-400.png', size : 1240, height : 600 }
    ],
    splashPath : 'resources/windows/splash/',
    splashes : [
      { name: 'SplashScreen.scale-100.png', width: 620,  height: 300  },
      { name: 'SplashScreen.scale-125.png', width: 775,  height: 375  },
      { name: 'SplashScreen.scale-150.png', width: 930,  height: 450  },
      { name: 'SplashScreen.scale-200.png', width: 1240, height: 600  },
      { name: 'SplashScreen.scale-400.png', width: 2480, height: 1200 }
    ]
  });
  // TODO: add missing platforms
  deferred.resolve(platforms);
  return deferred.promise;
};

/**
 * @var {Object} console utils
 */
var display = {};
display.success = function (str) {
  str = '✓  '.green + str;
  console.log('  ' + str);
};
display.error = function (str) {
  str = '✗  '.red + str;
  console.log('  ' + str);
};
display.header = function (str) {
  console.log('');
  console.log(' ' + str.cyan.underline);
  console.log('');
};

/**
 * Resizes, crops (if needed) and creates a new icon in the platform's folder.
 *
 * @param  {Object} platform
 * @param  {Object} icon
 * @return {Promise}
 */
var generateIcon = function (platform, icon) {
  var deferred = Q.defer();
  var srcPath = settings.ICON_FILE;
  var platformPath = srcPath.replace(/\.png$/, '-' + platform.name + '.png');
  if (fs.existsSync(platformPath)) {
    srcPath = platformPath;
  }
  var dstPath = platform.iconsPath + icon.name;
  var dst = path.dirname(dstPath);
  if (!fs.existsSync(dst)) {
    fs.mkdirsSync(dst);
  }
  gm(srcPath)
    .resize(icon.size,icon.size)
    .write(dstPath, function(err){
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve();
        display.success(icon.name + ' created');
      }
  });
  if (icon.height) {
    gm(srcPath)
      .crop(icon.size,icon.height)
      .write(dstPath, function(err){
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve();
          display.success(icon.name + ' cropped');
        }
    });
  }
  return deferred.promise;
};

/**
 * Crops and creates a new splash in the platform's folder.
 *
 * @param  {Object} platform
 * @param  {Object} splash
 * @return {Promise}
 */
var generateSplash = function (platform, splash) {
  var deferred = Q.defer();
  var srcPath = settings.SPLASH_FILE;
  var platformPath = srcPath.replace(/\.png$/, '-' + platform.name + '.png');
  if (fs.existsSync(platformPath)) {
    srcPath = platformPath;
  }
  var dstPath = platform.splashPath + splash.name;
  var dst = path.dirname(dstPath);
  if (!fs.existsSync(dst)) {
    fs.mkdirsSync(dst);
  }
  var x = (Math.max(splash.width, splash.height) - splash.width)/2;
  var y = (Math.max(splash.width, splash.height) - splash.height)/2;
  gm(srcPath)
    .resize(Math.max(splash.width, splash.height))
    .crop(splash.width, splash.height,x,y)
    .write(dstPath, function(err){
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve();
        display.success(splash.name + ' created');
      }
  });
  return deferred.promise;
};

/**
 * Generates icons based on the platform object
 *
 * @param  {Object} platform
 * @return {Promise}
 */
var generateIconsForPlatform = function (platform) {
  display.header('Generating Icons for ' + platform.name);
  var all = [];
  var icons = platform.icons;
  icons.forEach(function (icon) {
    all.push(generateIcon(platform, icon));
  });
  return Promise.all(all);
};

/**
 * Generates splash based on the platform object
 *
 * @param  {Object} platform
 * @return {Promise}
 */
var generateSplashForPlatform = function (platform) {
  display.header('Generating splash screen for ' + platform.name);
  var all = [];
  var splashes = platform.splashes;
  splashes.forEach(function (splash) {
    all.push(generateSplash(platform, splash));
  });
  return Promise.all(all);
};

/**
 * Goes over all the platforms and triggers icon generation
 *
 * @param  {Array} platforms
 * @return {Promise}
 */
var generateIcons = function (platforms) {
  var deferred = Q.defer();
  var sequence = Q();
  var all = [];
  _(platforms).where({ isAdded : true }).forEach(function (platform) {
    sequence = sequence.then(function () {
      return generateIconsForPlatform(platform);
    });
    all.push(sequence);
  });
  Q.all(all).then(function () {
    deferred.resolve();
  });
  return deferred.promise;
};

/**
 * Goes over all the platforms and triggers splash screen generation
 *
 * @param  {Array} platforms
 * @return {Promise}
 */
var generateSplashes = function (platforms) {
  var deferred = Q.defer();
  var sequence = Q();
  var all = [];
  _(platforms).where({ isAdded : true }).forEach(function (platform) {
    sequence = sequence.then(function () {
      return generateSplashForPlatform(platform);
    });
    all.push(sequence);
  });
  Q.all(all).then(function () {
    deferred.resolve();
  });
  return deferred.promise;
};

/**
 * Goes over all the platforms and triggers splash screen generation
 *
 * @param  {Array} platforms
 * @return {Promise}
 */
var generateResources = function (platforms) {
  var deferred = Q.defer();
  var sequence = Q();
  var all = [];
  _(platforms).where({ isAdded : true }).forEach(function (platform) {
    sequence = sequence.then(function () {
      return generateIconsForPlatform(platform);
    }).then(function () {
      return generateSplashForPlatform(platform);
    });
    all.push(sequence);
  });
  Q.all(all).then(function () {
    deferred.resolve();
  });
  return deferred.promise;
};

/**
 * Checks if at least one platform was added to the project
 *
 * @return {Promise} resolves if at least one platform was found, rejects otherwise
 */
var atLeastOnePlatformFound = function () {
  var deferred = Q.defer();
  getPlatforms().then(function (platforms) {
    var activePlatforms = _(platforms).where({ isAdded : true });
    if (activePlatforms.length > 0) {
      display.success('platforms found: ' + _(activePlatforms).pluck('name').join(', '));
      deferred.resolve();
    } else {
      display.error('No cordova platforms found.' +
                    'Make sure you are in the root folder of your Cordova project' +
                      'and add platforms with \'cordova platform add\'');
                      deferred.reject();
    }
  });
  return deferred.promise;
};

/**
 * Checks if a valid icon file exists
 *
 * @return {Promise} resolves if exists, rejects otherwise
 */
var validIconExists = function () {
  var deferred = Q.defer();
  fs.exists(settings.ICON_FILE, function (exists) {
    if (exists) {
      display.success(settings.ICON_FILE + ' exists');
      deferred.resolve();
    } else {
      display.error(settings.ICON_FILE + ' does not exist in the root folder');
      deferred.reject();
    }
  });
  return deferred.promise;
};

/**
 * Checks if a valid splash file exists
 *
 * @return {Promise} resolves if exists, rejects otherwise
 */
var validSplashExists = function () {
  var deferred = Q.defer();
  fs.exists(settings.SPLASH_FILE, function (exists) {
    if (exists) {
      display.success(settings.SPLASH_FILE + ' exists');
      deferred.resolve();
    } else {
      display.error(settings.SPLASH_FILE + ' does not exist in the root folder');
      deferred.reject();
    }
  });
  return deferred.promise;
};

display.header('Checking Project & Icon');

atLeastOnePlatformFound()
  .then(validIconExists)
  .then(validSplashExists)
  .then(getPlatforms)
  .then(generateResources)
  .catch(function (err) {
    if (err) {
      console.log(err);
    }
  }).then(function () {
    console.log('');
  });

