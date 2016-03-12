import $           from 'jquery';
export default class PageSlider {
    constructor() {}

    static setupSlides(currentSlide, nextSlide) {
        let curent = $(currentSlide);
        let next   = $(nextSlide);

        TweenMax.set(curent, { rotationX: 0 });
        TweenMax.set(curent.parent(), { yPercent: 0 });
        TweenMax.set(next, { rotationX: -90 });
        TweenMax.set(next.parent(), { yPercent: 100 });
    }

    static slideFromTo(currentSlide, nextSlide, duration = 1) {
        let curent = $(currentSlide);
        let next   = $(nextSlide);
        let ease   = Power1.easeInOut;
        let tl     =  new TimelineMax();

        tl.add([
            TweenMax.to(curent, duration, { rotationX: 90, ease }),
            TweenMax.to(curent.parent(), duration, { yPercent: -100, ease }),
            TweenMax.to(next, duration, { rotationX: 0, ease }),
            TweenMax.to(next.parent(), duration, { yPercent: 0, ease })
        ]);

        return tl;
    }
}
