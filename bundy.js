/*
* This file is for build process i.e. minification of files.
* You do not need it to run roulette application.
* */

var bundy = require('bundy');

bundy.js('script/roulette.js', 'script/roulette.min.js');

bundy.css('css/roulette.css', 'css/roulette.min.css');

bundy.build();