/**
 * RKit media
 */
RKit.Media = (function($) {
    'use strict';

    var base, config, Win, WinW, keys, MT, TD, mediaList, prefix;

    /* default config */
    config = {
        'breakpoints': {
            'M' : [768],
            'T' : [768, 1024],
            'D' : [1024]
        },
        'prefix' : 'media'
    };

    keys = Object.keys(config.breakpoints);
    MT = keys[0] + '' + keys[1];
    TD = keys[1] + '' + keys[2];

    mediaList = keys.slice(0);
    mediaList.push(MT, TD);

    /* stash public object */
    base = {};

    /**
     * Reset all media flags
     */
    base.resetMedia = function() {
        var mediaListLength = mediaList.length;
        for(var i = 0; i<mediaListLength; i++) {
            window[config.prefix + mediaList[i]] = false;
        }
    };

    /**
     * Set media break point
     * @param media
     */
    base.setMedia = function(media) {
        /* reset all media */
        base.resetMedia();

        /* set media */
        window[config.prefix + media] = true;

        /* trigger event */
        Win.trigger(config.prefix + media);

        /* RKit Module: Yoga */
        if ( typeof RKit.Y === "object" ) {
            RKit.Y.move(config.prefix + media);
        }
    };

    /**
     * Get media break point
     */
    base.getMedia = function() {
        WinW = RKit.U.getViewPortWidth();

        /* mobile */
        if ( !(window[config.prefix + keys[0]]) && (WinW <= config.breakpoints.M[0] - 1) ) {
            base.setMedia(keys[0]);
        }

        /* tablet */
        if ( !(window[config.prefix + keys[1]]) && (WinW >= config.breakpoints.T[0] && WinW <= config.breakpoints.T[1]) ) {
            base.setMedia(keys[1]);
        }

        /* desktop */
        if ( !(window[config.prefix + keys[2]]) && WinW > config.breakpoints.D[0]) {
            base.setMedia(keys[2]);
        }

        /* TODO: mobile & tablet */
        /* TODO: tablet & desktop */

    };

    /**
     * Initialize
     */
    base.init = function(conf) {
        if (typeof conf === "object") {
            config = $.extend({}, config, conf);
        }

        Win = $(window);
        setTimeout(base.getMedia, 0);
        Win.resize(base.getMedia);
    };

    return base;
})(jQuery);
