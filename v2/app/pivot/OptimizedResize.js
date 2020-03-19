var throttle = function (type, name, obj) {
    obj = obj || window;
    var running = false;
    var func = function () {
        if (running) { return; }
        running = true;
        requestAnimationFrame(function () {
            var event;
            if (typeof (Event) === 'function') {
                event = new Event(name);
            } else {
                event = document.createEvent('Event');
                event.initEvent(name, true, true);
            }

            obj.dispatchEvent(event); //new CustomEvent(name));
            running = false;
        });
    };
    obj.addEventListener(type, func);
};

function debounce(func, wait, immediate) {
    var timeout;

    return function executedFunction() {
        var context = this;
        var args = arguments;

        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };

        var callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (callNow) func.apply(context, args);
    };
};

/* init - you can init any event */
throttle("resize", "optimizedResize");