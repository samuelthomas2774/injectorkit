/**
 * InjectorKit for Discord
 */

const $ = require('jquery');

class Element {

    constructor(injectorkit, element_name, element) {
        this.injectorkit = injectorkit;
        this.element = element;
        this.element_name = element_name;

        this.started = false;
        this.injections = [];

        InjectorKit.watched_elements[this.element_name] =
        InjectorKit.watched_elements[this.element_name] || [];
    }

    start() {
        this.started = true;
        InjectorKit.watched_elements[this.element_name].push(this);
        $.each(this.injections, (key, injection) => {
            if (injection.started) return;
            this.inject(injection);
        });
    }

    stop() {
        this.started = false;
        InjectorKit.watched_elements[this.element_name] = InjectorKit.watched_elements[this.element_name].filter((index, element) => element === this);
        $.each(this.injections, (key, injection) => {
            if (!injection.started) return;
            this.uninject(injection);
        });
    }

    refresh() {
        if (!this.started) return;

        $.each(this.injections, (key, injection) => {
            this.uninject(injection);
            this.inject(injection);
        });
    }

    add(injection) {
        do {
            injection.id = Math.random();
        } while (this.injections.find(i => i.id === injection.id));

        injection.$injected = $();

        this.injections.push(injection);

        if (this.started && !injection.ignore_current_elements)
            this.inject(injection);

        return injection;
    }

    before(to_inject, inject_callback, uninject_callback) {
        return this.add({
            type: 'before',
            to_inject,
            inject_callback,
            uninject_callback
        });
    }

    after(to_inject, inject_callback, uninject_callback) {
        return this.add({
            type: 'after',
            to_inject,
            inject_callback,
            uninject_callback
        });
    }

    prepend(to_inject, inject_callback, uninject_callback) {
        return this.add({
            type: 'prepend',
            to_inject,
            inject_callback,
            uninject_callback
        });
    }

    append(to_inject, inject_callback, uninject_callback) {
        return this.add({
            type: 'append',
            to_inject,
            inject_callback,
            uninject_callback
        });
    }

    callback(inject_callback, uninject_callback) {
        return this.add({
            type: 'callback',
            to_inject: null,
            inject_callback,
            uninject_callback
        });
    }

    once(inject_callback, uninject_callback, ignore_current_elements) {
        return this.add({
            type: 'once',
            to_inject: null,
            inject_callback,
            uninject_callback,
			ignore_current_elements
        });
    }

    remove(injection_id, dont_uninject) {
        this.injections = this.injections.filter(injection => {
            if (injection_id && injection.id !== injection_id)
                return true;

            if (!dont_uninject)
                this.uninject(injection);
            return false;
        });
    }

    removeByInjectedElement(to_uninject, dont_uninject) {
        this.injections = this.injections.filter(injection => {
            if (!injection.to_inject || injection.to_inject !== to_uninject)
                return true;

            if (!dont_uninject)
                this.uninject(injection);
            return false;
        });
    }

    inject(injection) {
        const that = this;
        const type = injection.type;
        const $to_inject = $(injection.to_inject).data('injectorkit-injection', injection.id);

        console.log('Injecting', injection.to_inject, type, this.jQuery);

        const $elements = this.jQuery;
        const $uninjected_elements = $elements.filter(function() { return !$(this).data('injectorkit-started-' + injection.id); });

        $uninjected_elements.each(function() {
            let $element = $(this);
            let $injected = null;

            if (that['inject_at_' + type])
                $injected = that['inject_at_' + type](injection, $element, $to_inject);

            if (injection.inject_callback)
                injection.inject_callback(injection, $element, $injected);

            $element.data('injectorkit-injected-' + injection.id, $injected);
            injection.$injected = injection.$injected.add($injected);

            $element.data('injectorkit-started-' + injection.id, true);
        });

        injection.started = true;
    }

    inject_at_before(injection, $element, $to_inject) {
        console.log($to_inject, 'before', $element);
        return $to_inject.insertBefore($element);
    }

    inject_at_after(injection, $element, $to_inject) {
        return $to_inject.insertAfter($element);
    }

    inject_at_prepend(injection, $element, $to_inject) {
        return $to_inject.prependTo($element);
    }

    inject_at_append(injection, $element, $to_inject) {
        return $to_inject.appendTo($element);
    }

    inject_at_once(injection, $element, $to_inject) {
        this.remove(injection.id, true);
    }

    uninject(injection) {
        const that = this;
        const type = injection.type;
        const $to_inject = $(injection.to_inject);

        console.log('Uninjecting ', injection.to_inject, ' ', type, ' ', this.jQuery);

        const $elements = this.jQuery;
        const $injected_elements = $elements.filter(function() { return $(this).data('injectorkit-started-' + injection.id); });

        $injected_elements.each(function() {
            let $element = $(this);
            let $injected = $element.data('injectorkit-injected-' + injection.id);

            if (injection.uninject_callback)
                injection.uninject_callback(injection, $element, $injected);

            if (that['uninject_at_' + type])
                that['uninject_at_' + type](injection, $element, $to_inject, $injected);

            $element.data('injectorkit-started-' + injection.id, false);
        });

        injection.started = false;
    }

    uninject_at_before(injection, $element, $to_inject, $to_uninject) {
        $to_uninject.detach();
    }

    uninject_at_after(injection, $element, $to_inject, $to_uninject) {
        $to_uninject.detach();
    }

    uninject_at_prepend(injection, $element, $to_inject, $to_uninject) {
        $to_uninject.detach();
    }

    uninject_at_append(injection, $element, $to_inject, $to_uninject) {
        $to_uninject.detach();
    }

    unload() {
        this.stop();
    }

    get jQuery() {
        return this.element.jQuery;
    }

}

module.exports = Element;
