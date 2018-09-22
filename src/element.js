/**
 * InjectorKit for Discord
 */

import Injection from './injection';

const watched_elements = new Map();

export default class Element {
    constructor(injectorkit, element) {
        this.injectorkit = injectorkit;
        this.element = element;
        this.element_name = element.element_name;

        this.started = false;
        this.injections = [];
    }

    start() {
        this.started = true;

        if (!watched_elements.has(this.element)) {
            watched_elements.set(this.element, new Set());
        }

        watched_elements.get(this.element).add(this);

        for (let injection of this.injections) {
            if (injection.started) return;
            this.inject(injection);
        }
    }

    stop() {
        this.started = false;

        const elements = watched_elements.get(this.element);
        elements.delete(this);

        if (!elements.size) {
            elements.delete(this.element);
        }

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
        return Injection.createInjection(this, injection, injection.type);
    }

    before(to_inject, inject_callback, uninject_callback) {
        return this.add({
            type: 'before',
            to_inject,
            inject_callback,
            uninject_callback,
        });
    }

    after(to_inject, inject_callback, uninject_callback) {
        return this.add({
            type: 'after',
            to_inject,
            inject_callback,
            uninject_callback,
        });
    }

    prepend(to_inject, inject_callback, uninject_callback) {
        return this.add({
            type: 'prepend',
            to_inject,
            inject_callback,
            uninject_callback,
        });
    }

    append(to_inject, inject_callback, uninject_callback) {
        return this.add({
            type: 'append',
            to_inject,
            inject_callback,
            uninject_callback,
        });
    }

    callback(inject_callback, uninject_callback) {
        return this.add({
            type: 'callback',
            to_inject: null,
            inject_callback,
            uninject_callback,
        });
    }

    once(inject_callback, uninject_callback, ignore_current_elements) {
        if (!inject_callback) {
            return new Promise((resolve, reject) => {
                this.once((injection, element) => {
                    resolve(element);
                }, null, typeof ignore_current_elements === 'boolean' ? ignore_current_elements : true);
            });
        }

        return this.add({
            type: 'once',
            to_inject: null,
            inject_callback,
            uninject_callback,
            ignore_current_elements,
        });
    }

    remove(injection, dont_uninject) {
        let index;
        while ((index = this.injections.findIndex(i => i.id === injection || i === injection)) > -1) {
            if (!dont_uninject) this.uninject(this.injections[index]);

            this.injections.splice(index, 1);
        }
    }

    inject(injection) {
        return injection.inject();
    }

    injectNode(node) {
        for (let injection of this.injections) {
            injection.injectNode(node);
        }
    }

    addedNode(node) {
        this.injectNode(node);
    }

    uninject(injection) {
        return injection.uninject();
    }

    uninjectNode(node) {
        for (let injection of this.injections) {
            injection.uninjectNode(node);
        }
    }

    removedNode(node) {
        this.uninjectNode(node);
    }

    unload() {
        this.stop();
    }

    get nodes() {
        return this.element.nodes;
    }

    static get watched_elements() {
        return watched_elements;
    }
}
