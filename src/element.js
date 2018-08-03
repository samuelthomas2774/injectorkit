/**
 * InjectorKit for Discord
 */

const $ = require('jquery');

const InjectorKit = require('./main');
const Injection = require('./injection');

const watched_elements = new Map();

class Element {

    constructor(injectorkit, element) {
        this.injectorkit = injectorkit;
        this.element = element;
        this.element_name = element.element_name;

        this.started = false;
        this.injections = [];

        InjectorKit.watched_elements[this.element_name] =
        InjectorKit.watched_elements[this.element_name] || [];
    }

    start() {
        this.started = true;
        InjectorKit.watched_elements[this.element_name].push(this);

        for (let injection of this.injections) {
            if (injection.started) return;
            this.inject(injection);
        }
    }

    stop() {
        this.started = false;
        InjectorKit.watched_elements[this.element_name] = InjectorKit.watched_elements[this.element_name].filter((index, element) => element === this);

        for (let injection of this.injections) {
            if (!injection.started) return;
            this.uninject(injection);
        }
    }

    refresh() {
        if (!this.started) return;

        for (let injection of this.injections) {
            this.uninject(injection);
            this.inject(injection);
        }
    }

    add(injection) {
        return new Injection(this, injection);
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
		if (!inject_callback) {
			return new Promise((resolve, reject) => {
				this.once((injection, $element) => {
					resolve($element);
				}, null, typeof ignore_current_elements === 'boolean' ? ignore_current_elements : true);
			});
		}

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
        return injection.inject();
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
        return injection.uninject();
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

    get nodes() {
        return this.element.nodes;
    }

    static get watched_elements() {
        return watched_elements;
    }

}

module.exports = Element;
