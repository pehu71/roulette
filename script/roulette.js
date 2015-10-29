/*
 Roulette v1.0
 (c) 2015 Petr -pehu- Humplik, http://pehu.info
 License: MIT
 */
'use strict';
var roulette = angular.module('roulette', []);

roulette.directive('phRoulette', ['$interval', function ($interval) {
    return {
        restrict: 'A',
        replace: false,
        transclude: false,
        scope: {},
        link: function (scope, element, attrs) {

            scope.config = scope.$eval(attrs.phRoulette);

            if (!angular.isObject(scope.config) || Object.keys(scope.config).length === 0) return;
            scope.useBgImage = angular.isObject(scope.config.bgImage) && Object.keys(scope.config.bgImage).length > 0;

            scope.titleBoxSelector = 'titleBox_' + scope.$id;
            angular.element(element).addClass('roulette-container');

            var fullCircle = 2 * Math.PI;
            var bgImageId = 'ci' + scope.$id;
            var thumbWidth = scope.config.thumb.width;
            var thumbHeight = scope.config.thumb.height;
            var anchors = element.children();
            var time;

            /* setting some more global variables */
            scope.imageCount = anchors.length;
            scope.angleIncrement = scope.config.angleStep * Math.PI / 180;
            scope.angle = 0;
            scope.run = true;
            scope.currentTitle = '';

            /* setting canvas dimensions and center */
            scope.canvasWidth = angular.element(element).width();
            scope.canvasHeight = angular.element(element).height();

            scope.center = {
                x: scope.canvasWidth / 2,
                y: scope.canvasHeight / 2
            };

            /* setting title box */
            var initTitleBox = function () {
                var titleBox = angular.element('<a class="titleBox" id="' + scope.titleBoxSelector + '"></a>');
                angular.element(titleBox).children('img').first().attr('src', angular.element(anchors[0]).children('img').first().attr('src'));
                var w = 0.75 * scope.config.radius;
                var h = 0.5 * scope.config.radius;

                angular.element(titleBox).css({
                    width: w,
                    height: h,
                    left: scope.center.x - w / 2,
                    top: scope.center.y - h / 2
                });
                angular.element(element).append(titleBox);
                scope.titleBox = titleBox[0];
            };

            /* setting background image */
            var initBgImage = function () {
                var bgImageElement = angular.element('<img id="' + bgImageId + '" class="bgImage"/>');

                var left = scope.center.x - scope.config.bgImage.width / 2;
                var top = scope.center.y - scope.config.bgImage.height / 2;
                angular.element(bgImageElement).css({
                    left: left,
                    top: top,
                    width: scope.config.bgImage.width,
                    height: scope.config.bgImage.height
                });
                angular.element(bgImageElement).attr('src', scope.config.bgImage.src);
                angular.element(element).append(bgImageElement);
                scope.bgImage = bgImageElement[0];
            };

            /* entry point - if no images found we exit */
            if (scope.imageCount > 0) {

                scope.angleStep = 2 * Math.PI / scope.imageCount;

                /* setting properties of thumbnails and binding their handlers */
                angular.element(anchors).each(function() {

                    var title = angular.element(this).children('img').attr('title');
                    var href = angular.element(this).attr('href');

                    angular.element(this).css({width: thumbWidth, height: thumbHeight, padding: 0, margin: 0});
                    angular.element(this).children('img').css({width: thumbWidth, height: thumbHeight});

                    /* thumbnail mouse enter changes link and description in title box */
                    angular.element(this).on('mouseenter', function () {
                        scope.setTitleBox(title, href);
                    });
                });

            } else {
                return;
            }

            /* set link and title in the title box when thumbnail traverses angle = 0 or when mouse enters thumbnail */
            scope.setTitleBox = function (imgTitle, imgLink) {

                angular.element(scope.titleBox).css('display', 'none');
                angular.element(scope.titleBox).html('<span>' + imgTitle + '</span>');
                angular.element(scope.titleBox).attr('href', imgLink);
                angular.element(scope.titleBox).fadeIn(500);

                scope.currentTitle = imgTitle;
            };

            /* rotating thumbnails and background image as well */
            var setPositions = function () {

                if (!scope.run) return;

                for (var i = 0; i < scope.imageCount; i++) {

                    var imageTitle = angular.element(anchors[i]).children('img').first().attr('title');
                    var imageLink = angular.element(anchors[i]).attr('href');

                    var imageAngle = scope.angle + i * scope.angleStep;

                    var x = scope.center.x + (scope.config.radius * Math.cos(imageAngle) - thumbWidth / 2);
                    var y = scope.center.y - (scope.config.radius * Math.sin(imageAngle) + thumbHeight / 2);

                    if ((Math.abs(scope.center.y - (y + thumbHeight / 2)) <= 5) && x > scope.center.x) {

                        if (imageTitle != scope.currentTitle) {
                            scope.setTitleBox(imageTitle, imageLink);
                        }
                    }

                    angular.element(anchors[i]).css('left', x + 'px');
                    angular.element(anchors[i]).css('top', y + 'px');
                    if (scope.useBgImage) scope.bgImage.style.transform = 'rotate('+scope.angle+'rad)';

                    if (scope.config.rotation === 'ccw') {
                        scope.angle += scope.angleIncrement;
                    } else {
                        scope.angle -= scope.angleIncrement;
                    }
                    scope.angle %= fullCircle;
                }
            };

            /* when scope is destroyed we destroy the timer object as well */
            element.on('$destroy', function () {
                $interval.cancel(time);
            });

            /* canvas mouseenter stops rotation of objects */
            angular.element(element).on('mouseenter', function () {
                scope.run = false;
            });

            /* canvas mouseleave enables rotation of objects again */
            angular.element(element).on('mouseleave', function () {
                scope.run = true;
            });

            /* on each timer interval we rotate */
            time = $interval(setPositions, scope.config.delay);

            initTitleBox();

            if (scope.useBgImage) initBgImage();

        }

    };
}]);
