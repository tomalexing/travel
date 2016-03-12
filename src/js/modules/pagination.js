import $           from 'jquery';
export const pagination = (() => {
    const fakeDotIndex = 2;
    const activeClass  = 'is-active';
    const $dots        = $('.pagination__link');
    const $dotsReal    = $dots.not(`:nth-child(${fakeDotIndex})`);

    function toggle(index, real = false) {
        let $targetDots = real ? $dotsReal : $dots;
        if (typeof index !== 'number' && !isFinite(index)) return;
        $dots.filter(`.${activeClass}`).removeClass(activeClass);
        $targetDots.eq(index).addClass(activeClass);
    }

    function reset() {
        $dots.filter(`.${activeClass}`).removeClass(activeClass);
    }

    return {
        toggle,
        reset
    };
})();
