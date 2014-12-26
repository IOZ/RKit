/**
 * RKit - Responsive Kit which contains usefull components for develop reponsive web application.
 * @version 1.0.0
 * @date Fri Dec 26 2014 13:07:52 GMT+0100 (Central Europe Standard Time)
 */ 

/**
 * RKit - responsive web kit for developers
 * Core
 */
var RKit = {
    version: '1.0.0'
};

/**
 * RKit Helper Methods
 */
(function($) {
    'use strict';

    window.RKit = RKit || {};

    RKit.getViewPortWidth = function() {
        var viewPortWidth;

        if (typeof window.innerWidth != 'undefined') {
            viewPortWidth  = window.innerWidth;
        }
        else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
            viewPortWidth  = document.documentElement.clientWidth;
        }
        else {
            viewPortWidth  = document.getElementsByTagName('body')[0].clientWidth;
        }

        return viewPortWidth;
    };

    /**
     * Detect mobile
     */
    RKit.isMobile = function() {
        var re = /(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i;
        return re.test(window.navigator.userAgent)
    };

    /**
     * Detect retina displays
     */
    RKit.isRetina = function() {
        if (window.devicePixelRatio) {
            return window.devicePixelRatio >= 2;
        } else {
            return false;
        }
    };

    /**
     * Image loader
     * @param {object} container - jquery object which contains images
     */
    RKit.imageLoader = function(container, fn) {
        var target, n, c, images, image, imageIterator;

        if (typeof container === "object") {
            target = container;
        } else if (typeof container === "string") {
            target = $(container);
        }

        images = target.find('img');
        n = images.length;
        c = 0;
        imageIterator = function() {
            c++;
            if (c === n) {
                if (typeof fn === "function") {
                    fn.call(this);
                }
            }
        };

        images.each(function() {
            image = $(this);
            /* if image was cached */
            if (image[0].complete) {
                imageIterator();
            } else {
                image.one('load error', function() {
                    imageIterator();
                });
            }
        });
    };

})(jQuery);

/**
 * RKit: yoga
 * move block from one place to another with reverting when breakpoint was leave
 *
 * Used data attributes
 * data-push="{selector}"
 * data-dir="{after|before|append|prepend}"
 * data-bp="{media{M|T|D}}"
 */
RKit.Yoga = (function($) {
   'use strict';

    var api, config;

    /* default config */
    config = {
        dataPush: "push"
    };

    api = {};

    /**
     * Blocks storage
     * @type {Array}
     */
    api.blocksStorage = [];

    /**
     * Cache all blocks
     */
    api.getBlocks = function() {
        var $block, $pushTo, pushDir, pushBreakPoint, $startBlockPos, startDir;
        $("[data-" + config.dataPush +"]").each(function() {
            $block = $(this);
            $pushTo = $($block.data(config.dataPush));
            pushDir = $block.data('dir');
            pushBreakPoint = $block.data('bp');

            /* find initial block position */
            if ($block.prev().length) {
                $startBlockPos = $block.prev();
                startDir = "after";
            } else if ($block.next().length) {
                $startBlockPos = $block.next();
                startDir = "before";
            } else {
                $startBlockPos = $block.parent();
                startDir = "append";
            }

            api.blocksStorage.push({
                $block: $block,
                $pushTo: $pushTo,
                pushDir: pushDir,
                pushBreakPoint: pushBreakPoint,
                $startBlockPos: $startBlockPos,
                startDir: startDir,
                isInsert: false
            });
        });
    };

    /**
     * Move block
     * @param media
     */
    api.move = function(media) {
        var i, len, $pushTo, $block, isInsert, breakPoint, dir, $startBlockPos, startDir;
        len = api.blocksStorage.length;
        for (i = 0; i < len; i++) {

            $pushTo = api.blocksStorage[i].$pushTo;
            $block = api.blocksStorage[i].$block;
            breakPoint = api.blocksStorage[i].pushBreakPoint;
            dir = api.blocksStorage[i].pushDir;
            $startBlockPos = api.blocksStorage[i].$startBlockPos;
            startDir = api.blocksStorage[i].startDir;
            isInsert = api.blocksStorage[i].isInsert;

            if ( breakPoint == media && !isInsert ) {
                switch (dir) {
                    case 'before':
                        $block.insertBefore($pushTo);
                        break;
                    case 'after':
                        $block.insertAfter($pushTo);
                        break;
                    case 'append':
                        $block.appendTo($pushTo);
                        break;
                    case 'prepend':
                        $block.prependTo($pushTo);
                        break;
                }
                api.blocksStorage[i].isInsert = true;
            } else if ( breakPoint == media && isInsert ) {
                switch (dir) {
                    case 'before':
                        $block.insertBefore($pushTo);
                        break;
                    case 'after':
                        $block.insertAfter($pushTo);
                        break;
                    case 'append':
                        $block.appendTo($pushTo);
                        break;
                    case 'prepend':
                        $block.prependTo($pushTo);
                        break;
                }
            } else if ( breakPoint !== media && isInsert ) {
                switch (startDir) {
                    case 'before':
                        $block.insertBefore($startBlockPos);
                        break;
                    case 'after':
                        $block.insertAfter($startBlockPos);
                        break;
                    case 'append':
                        $block.appendTo($startBlockPos);
                        break;
                    case 'prepend':
                        $block.prependTo($startBlockPos);
                        break;
                }
            }
        }
    };

    /**
     * Initialize
     */
    api.init = function() {
        api.getBlocks();
    };

    return api;
})(jQuery);

RKit.Y = RKit.Yoga;

/**
 * RKit media
 */
RKit.Media = (function($) {
    'use strict';

    var api, config, Win, WinW;

    /* default config */
    config = {
        'breakpoints': [
            ['mediaM', 768],
            ['mediaT', [768, 1024]],
            ['mediaD', 1024]
        ]
    };

    /* stash public methods */
    api = {};

    /**
     * Reset all media flags
     */
    api.resetMedia = function() {
        for(var i = 0, mediaLength = config.breakpoints.length; i < mediaLength; i++) {
            window[config.breakpoints[i][0]] = false;
        }
    };

    /**
     * Set media break point
     * @param media
     */
    api.setMedia = function(media) {
        /* reset all media */
        api.resetMedia();

        /* set media */
        window[media] = true;

        /* trigger event */
        Win.trigger(media);

        /* RKit Module: Yoga */
        if ( typeof RKit.Y === "object" ) {
            RKit.Y.move(media);
        }
    };
    /**
     * Get media break point
     */
    api.getMedia = function() {
        WinW = RKit.getViewPortWidth();
        /* mobile */
        if ( !(window[ config.breakpoints[0][0] ]) && (WinW <= config.breakpoints[0][1] - 1) ) {
            api.setMedia(config.breakpoints[0][0]);
        }

        /* tablet */
        if ( !(window[ config.breakpoints[1][0] ]) && (WinW >= config.breakpoints[1][1] && WinW <= config.breakpoints[1][2]) ) {
            api.setMedia(config.breakpoints[1][0]);
        }

        /* desktop */
        if ( !(window[ config.breakpoints[2][0] ]) && WinW > config.breakpoints[2][1]) {
            api.setMedia(config.breakpoints[2][0]);
        }

    };

    /**
     * Initialize
     */
    api.init = function(conf) {
        if (typeof conf === "object") {
            config = $.extend({}, config, conf);
        }

        Win = $(window);
        setTimeout(api.getMedia, 0);
        Win.resize(api.getMedia);
    };

    return api;
})(jQuery);

/**
 * RKit: Application Initialize
 *
 */
RKit.init = function (conf) {
    /* Module: Media */
    if (typeof conf.media === "object") {
        RKit.Media.init(conf.media);
    }

    /* Module: Yoga */
    if (conf.yoga) {
        RKit.Y.init();
    }
};
