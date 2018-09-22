/**
 * InjectorKit
 */

import Injection from './injection';

export const watched_elements = new Map();

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

    /**
     * Creates a new injection.
     *
     * @param {Object} data
     * @param {String} data.type The type of injection
     * @param {HTMLElement} data.to_inject
     * @param {Function} data.inject_callback
     * @param {Function} data.uninject_callback
     * @return {Injection}
     */
    add(data) {
        return Injection.createInjection(this, data, data.type);
    }

    /**
     * Creates a new injection of type "before".
     *
     * @param {HTMLElement} to_inject
     * @param {Function} inject_callback
     * @param {Function} uninject_callback
     * @return {Injection}
     */
    before(to_inject, inject_callback, uninject_callback) {
        return this.add({
            type: 'before',
            to_inject,
            inject_callback,
            uninject_callback,
        });
    }

    /**
     * Creates a new injection of type "after".
     *
     * @param {HTMLElement} to_inject
     * @param {Function} inject_callback
     * @param {Function} uninject_callback
     * @return {Injection}
     */
    after(to_inject, inject_callback, uninject_callback) {
        return this.add({
            type: 'after',
            to_inject,
            inject_callback,
            uninject_callback,
        });
    }

    /**
     * Creates a new injection of type "prepend".
     *
     * @param {HTMLElement} to_inject
     * @param {Function} inject_callback
     * @param {Function} uninject_callback
     * @return {Injection}
     */
    prepend(to_inject, inject_callback, uninject_callback) {
        return this.add({
            type: 'prepend',
            to_inject,
            inject_callback,
            uninject_callback,
        });
    }

    /**
     * Creates a new injection of type "append".
     *
     * @param {HTMLElement} to_inject
     * @param {Function} inject_callback
     * @param {Function} uninject_callback
     * @return {Injection}
     */
    append(to_inject, inject_callback, uninject_callback) {
        return this.add({
            type: 'append',
            to_inject,
            inject_callback,
            uninject_callback,
        });
    }

    /**
     * Creates a new injection of type "callback".
     *
     * @param {Function} inject_callback
     * @param {Function} uninject_callback
     * @return {Injection}
     */
    callback(inject_callback, uninject_callback) {
        return this.add({
            type: 'callback',
            to_inject: null,
            inject_callback,
            uninject_callback,
        });
    }

    /**
     * Creates a new injection of type "once".
     *
     * @param {Function} inject_callback
     * @param {Function} uninject_callback
     * @param {boolean} ignore_current_elements
     * @return {(Injection|Promise)}
     */
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

    /**
     * Removes an injection.
     *
     * @param {(Injection|number)} injection
     * @param {boolean} dont_uninject
     */
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
}
