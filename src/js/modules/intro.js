import { pubSub, eventsNames } from './pub-sub';
import 'gsap';
import debounce                from 'lodash/debounce';
import $                       from 'jquery';

export default (() => {
    const $intro       = $('.intro');
    const $chars       = $intro.find('.parallax__row .char:not(.char-placeholder)');
    const $charsA      = $intro.find('.char-a');
    const $parallaxIn  = $intro.find('.parallax__inner');
    const $parallaxL1  = $intro.find('.parallax__layer-1');
    const $parallaxL2  = $intro.find('.parallax__layer-2');
    const $parallaxL3  = $intro.find('.parallax__layer-3');
    const $parallaxSt  = $intro.find('.parallax__layer-static');
    const $text        = $intro.find('.intro__main-text');
    const $button      = $text.find('.btn');
    const $triangle    = $intro.find('.intro__triangle .svg-icon');
    const animation    = new TimelineMax({ paused: true });
    const isSafari     = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    let parallaxActive = false;
    let allowParallax  = false;

    // animations properties for each character in words 'coming soon'
    const deltaYForChar = 300;
    const animProp = [
        // m
        {
            duration: 0.2,
            delay: 0.4,
            y: -deltaYForChar
        },
        // i
        {
            duration: 0.2,
            delay: 0.5,
            y: -deltaYForChar
        },
        // o
        {
            duration: 0.2,
            delay: 0.4,
            y: deltaYForChar
        },
        // c
        {
            duration: 0.4,
            delay: 0,
            y: -deltaYForChar
        },
        // o
        {
            duration: 0.4,
            delay: 0.175,
            y: -deltaYForChar
        },

        // n
        {
            duration: 0.25,
            delay: 0.25,
            y: -deltaYForChar
        },
        // g
        {
            duration: 0.3,
            delay: 0.3,
            y: -deltaYForChar
        },
        // s
        {
            duration: 0.4,
            delay: 0.05,
            y: deltaYForChar
        },

        // o
        {
            duration: 0.35,
            delay: 0.2,
            y: deltaYForChar
        },
        // n
        {
            duration: 0.2,
            delay: 0.35,
            y: deltaYForChar
        }
    ];

    $(window).on('resize', debounce(_updateAnimation, 300));

    animation
        .add(
            animProp.map((props, i) => {
                return TweenMax.to($chars[i], props.duration, {
                    y: props.y,
                    delay: props.delay,
                    opacity: 0,
                    ease: Power1.easeInOut
                });
            }, 0)
        )
        .add(() => $intro.toggleClass('is-animated'))
        .add([
            TweenMax.fromTo($charsA[0], 0.5, {
                x: 0
            }, {
                x: window.innerWidth / 2,
                ease: Power1.easeInOut
            }),
            TweenMax.fromTo($charsA[1], 0.5, {
                x: 0
            }, {
                x: -window.innerWidth / 2,
                ease: Power1.easeInOut
            }),
            TweenMax.to($triangle, 0.5, {
                scale: 0.625
            })
        ], '-=0.1')
        .fromTo($text, 0.5, {
            autoAlpha: 0
        }, {
            autoAlpha: 1
        })
        .fromTo($button, 0.4, {
            y: 100,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            ease: Power1.easeInOut
        }, '-=0.3')
        .add(() => {
            pubSub.emit(eventsNames.INTRO_END_ANIMATIONS, { animation });
        });

    function _rotateLayers(e, posY = 0) {
        var pageX, pageY, x, y, angleX, angleY, dur;

        if (typeof e === 'object') {
            pageX = e.pageX;
            pageY = e.pageY;
        } else {
            pageX = e;
            pageY = posY;
        }

        x = pageX - window.innerWidth / 2;
        y = pageY - window.innerHeight / 2;
        angleY = -x * 0.008;
        angleX = y * 0.008;
        dur    = 0.5;

        TweenMax.to($parallaxL1, dur, {
            x: x * 0.005,
            y: y * 0.005,
            rotationX: `${angleX}deg`,
            rotationY: `${angleY}deg`
        });
        TweenMax.to($parallaxL2, dur, {
            x: -x * 0.01,
            y: -y * 0.01,
            rotationX: `${angleX}deg`,
            rotationY: `${angleY}deg`
        });
        TweenMax.to($parallaxL3, dur, {
            x: -x * 0.025,
            y: -y * 0.025,
            rotationX: `${angleX}deg`,
            rotationY: `${angleY}deg`
        });
        if (isSafari) {
            TweenMax.to($parallaxSt, dur, {
                x: -x * 0.015,
                y: -y * 0.015,
                rotationX: `${angleX}deg`,
                rotationY: `${angleY}deg`
            });
        }
    }

    function _updateAnimation(e) {
        let tweens   = animation.getTweensOf($charsA);
        let tween1   = tweens[0];
        let tween2   = tweens[1];
        let newX     = window.innerWidth / 2;
        let progress = animation.progress();
        // animation was played at least once
        if (typeof tweens[0].vars.css === 'object') {
            tween1.vars.css.x = newX;
            tween2.vars.css.x = -newX;
            tween1.invalidate().progress(progress);
            tween2.invalidate().progress(progress);
        } else {
            tween1.updateTo({x: newX});
            tween2.updateTo({x: -newX});
        }
    }

    function enableParallax() {
        if (!allowParallax || parallaxActive) return;
        $(document).on('mousemove', _rotateLayers);
        parallaxActive = true;
    }

    function disableParallax() {
        if (!parallaxActive) return;
        $(document).off('mousemove', _rotateLayers);
        TweenMax.to([$parallaxL1, $parallaxL2, $parallaxL3], 0.5, {
            x: 0,
            y: 0,
            rotationY: 0,
            rotationX: 0
        });
        if (isSafari) {
            TweenMax.to($parallaxSt, 0.5, {
                x: 0,
                y: 0,
                rotationY: 0,
                rotationX: 0
            });
        }
        parallaxActive = false;
    }

    function toggleParallax() {
        if (parallaxActive) {
            disableParallax();
        } else {
            enableParallax();
        }
    }

    function demonstarateParallax(makeAllowOnly) {
      _rotateLayers(0, 0);
      allowParallax = true;
      enableParallax();
        // let width = window.innerWidth;
        // let height = window.innerHeight;
        //
        // if (makeAllowOnly) {
        //     allowParallax = true;
        //     return;
        // }
        //
        // _rotateLayers(0, 0);
        // setTimeout(() => _rotateLayers(width/2, height/2), 500);
        // setTimeout(() => _rotateLayers(width / 4, height / 4), 1000);
        // setTimeout(() => {
        //     allowParallax = true;
        //     enableParallax();
        // }, 1500);
    }

    function toggleIntroTextVisibility() {
        let opacity = $text[0].style.opacity;
        let visible = opacity === '1';
        TweenMax.set($text, {
            autoAlpha: visible ? 0 : 1
        });
        TweenMax.set($button, {
            opacity: visible ? 0 : 1,
            y: 0
        });
    }

    return {
        enableParallax,
        disableParallax,
        toggleParallax,
        animation,
        toggleIntroTextVisibility,
        demonstarateParallax
    };
})();
