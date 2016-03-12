import $           from 'jquery';
import { createHeadingAnimFor, createAboutAnimFor } from './animations-base';

const $qmedic   = $('.project[data-animations=qmedic]');
const $milkyway = $('.project[data-animations=milkyway]');
const $rexpro   = $('.project[data-animations=rexpro]');

const qmedic    = new TimelineMax({ paused: true });
const milkyway  = new TimelineMax({ paused: true });
const rexpro    = new TimelineMax({ paused: true });

const ease      = Power3.easeOut;

qmedic
    .add(createHeadingAnimFor($qmedic))
    .fromTo($qmedic.find('.project__image'), 0.5, {
        yPercent: 50,
        opacity: 0
    }, {
        yPercent: 0,
        opacity: 1,
        ease
    })
    .fromTo($qmedic.find('.project__bg'), 0.5, {
        yPercent: 100,
        opacity: 0
    }, {
        yPercent: 0,
        opacity: 1,
        ease
    }, '-=0.2')
    .add(createAboutAnimFor($qmedic), '-=0.5');

milkyway
    .add(createHeadingAnimFor($milkyway))
    .add([
        TweenMax.fromTo($milkyway.find('.milkyway'), 0.6, {
            yPercent: 150,
            opacity: 0
        }, {
            yPercent: 0,
            opacity: 1,
            ease
        }),
        TweenMax.fromTo($milkyway.find('.milkyway__layer-0'), 0.6, {
            x: 200
        }, {
            x: 0,
            ease
        }),
        TweenMax.fromTo($milkyway.find('.milkyway__layer-2'), 0.3, {
            x: -200,
            opacity: 0
        }, {
            x: 0,
            delay: 0.3,
            opacity: 1,
            ease
        }),
        TweenMax.fromTo($milkyway.find('.bg-milkyway__layer-1'), 0.3, {
            xPercent: 100,
            opacity: 0
        }, {
            xPercent: 0,
            delay: 0.3,
            opacity: 1,
            ease
        }),
        TweenMax.fromTo($milkyway.find('.milkyway__layer-1'), 0.3, {
            yPercent: 100,
            opacity: 0
        }, {
            yPercent: 0,
            delay: 0.5,
            opacity: 1,
            ease
        })
    ])
    .add([
        TweenMax.fromTo($milkyway.find('.bg-milkyway__layer-2'), 0.4, {
            yPercent: 100,
            opacity: 0
        }, {
            yPercent: 0,
            opacity: 1,
            ease
        }),
        createAboutAnimFor($milkyway)
    ], '-=0.3');

rexpro
    .add(createHeadingAnimFor($rexpro))
    .addLabel('begin', 0)
    .fromTo($rexpro.find('.bg-rex-pro__layer-2'), 0.6, {
        xPercent: -100
    }, {
        xPercent: 0,
        ease
    })
    .fromTo($rexpro.find('.project__image'), 0.5, {
        yPercent: 70,
        opacity: 0
    }, {
        yPercent: 0,
        opacity: 1,
        ease
    }, 'begin+=0.2')
    .fromTo($rexpro.find('.bg-rex-pro__layer-3'), 0.6, {
        opacity: 0
    }, {
        opacity: 1,
        ease
    }, 'begin+=0.5')
    .add(createAboutAnimFor($rexpro), 'begin+=0.5');

// return all Timelines include Timeline from ./intro.js
export const animations = {
    qmedic,
    milkyway,
    rexpro
};

export function setAnimationsProgress(val = 0) {
    for (let key in animations) {
        if (!animations.hasOwnProperty(key) || key === 'intro') continue;
        animations[key].progress(val);
    }
}
