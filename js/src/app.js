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
    if (typeof conf.yoga === "object") {
        RKit.Y.init(conf.yoga);
    }
};
