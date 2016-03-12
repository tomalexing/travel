import { pubSub, eventsNames } from './pub-sub';
import $                       from 'jquery';
import 'fullpage.js';
export default function activateFullpage() {
    const fp            = $('#fullpage');
    const slides        = fp.find('.section');
    const slideCount    = slides.length;
    let directionBefore = null;
    let prevIndex       = null;

    fp.fullpage({
        verticalCentered: false,
        scrollingSpeed: 700,
        anchors: [ 'intro', 'qmedic', 'milkyway', 'rexpro' ],
        autoScrolling: true,
        scrollBar: false,
        fixedElements: null,
        navigation: false,
        navigationPosition: 'right',
        responsiveWidth: 1024,
        // responsiveHeight: 650,
        recordHistory: true,
        fitToSection: true,
        easingcss3: 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
        onLeave: function(index, nextIndex, direction) {
            let props = {
                slide: this,
                index,
                nextIndex,
                direction,
                slideCount
            };

            if (index === 1) {
                pubSub.emit(eventsNames.FP_INTRO_FOCUSOUT, props);
            }

            pubSub.emit(eventsNames.FP_BEFORE_CHANGE, props);

            directionBefore = direction;
            prevIndex = index;
        },
        afterLoad: function(anchorLink, index) {
            let props = { slide: this, anchorLink, index, prevIndex, directionBefore };

            if (index === 1) pubSub.emit(eventsNames.FP_INTRO_FOCUSIN, props);
            pubSub.emit(eventsNames.FP_AFTER_CHANGE, props);
        },
        afterRender: function() {
            pubSub.emit(eventsNames.FP_INIT, { slides });
        }
    });
}
