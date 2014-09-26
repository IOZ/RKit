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
