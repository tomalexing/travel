import { pubSub, eventsNames } from './pub-sub';
import $                       from 'jquery';
export default (() => {
    const $root    = $('body');
    let disabled   = false;
    let direction  = null;
    let scrollPos  = $(window).scrollTop();
    let prevDeltaY = null; // need for fix bug when scrolling from touchpad
    let wheeling   = null;

    $root.on('wheel', (e) => {
        _detectScrollDirection(e);
        if (!wheeling) {
            // start of wheeling
            pubSub.emit(eventsNames.WHEEL_START, e, direction);
        }
        clearTimeout(wheeling);
        wheeling = setTimeout(() => {
            // end of wheeling
            wheeling = null;
            pubSub.emit(eventsNames.WHEEL_END, e, direction);
            direction = null;
        }, 100);
    });

    $root.on('scroll', (e) => {
        scrollPos = $(window).scrollTop();
    });

    function _preventScroll(e) {
        e.preventDefault();
    }

    function _detectScrollDirection(e) {
        let deltaY = e.originalEvent.deltaY;
        if (deltaY < 0) {
            direction = 'up';
        } else if (deltaY > 0) {
            direction = 'down';
        } else {
            direction = (prevDeltaY < 0) ? 'up' : 'down';
        }
        prevDeltaY = deltaY;
    }

    function disable() {
        if (disabled) return;
        $root.on('wheel', _preventScroll);
        disabled = true;
    }

    function enable() {
        if (!disabled) return;
        $root.off('wheel', _preventScroll);
        disabled = false;
    }

    function isDisabled() {
        return disabled;
    }

    function getScrollPos() {
        return scrollPos;
    }

    function getDirection(argument) {
        return direction;
    }

    return {
        disable,
        enable,
        isDisabled,
        getDirection,
        getScrollPos
    };
})();
