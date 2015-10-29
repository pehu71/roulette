/*
* This file is for build process i.e. minification of files.
* You do not need it to run roulette application.
* */

var bundy = require('bundy');

bundy.js('roulette/script/roulette.js', 'roulette/script/roulette.min.js');

bundy.css('roulette/css/roulette.css', 'roulette/css/roulette.min.css');

bundy.build();