const events = (() => {
    const topics = {};
    const hOP = topics.hasOwnProperty;

    return {
        subscribe: function(topic, listener) {
            let index;
            // Create the topic's object if not yet created
            if (!hOP.call(topics, topic)) topics[topic] = [];

            // Add the listener to queue
            index = topics[topic].push(listener) - 1;

            // Provide handle back for removal of topic
            return {
                remove: function() {
                    delete topics[topic][index];
                }
            };
        },
        publish: function(topic, info) {
            // If the topic doesn't exist, or there's no listeners in queue, just leave
            if (!hOP.call(topics, topic)) return;

            // Cycle through topics queue, fire!
            topics[topic].forEach(function(item) {
                item(info != undefined ? info : {});
            });
        },
        names: {
            INTRO_END_ANIMATIONS: 'introAnimEnd',
            FP_INTRO_FOCUSIN: 'fpIntroFocusIn',
            FP_INTRO_FOCUSOUT: 'fpIntroFocusOut',
            FP_BEFORE_CHANGE: 'fpBeforeChange',
            FP_AFTER_CHANGE: 'fpAfterChange',
            FP_LOOP_TOP: 'fpLoopTop',
            FP_INIT: 'fpInit'
        }
    };
})();

export default events;

