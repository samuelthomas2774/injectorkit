/**
 * InjectorKit for Discord
 *
 * This file contains a list of elements in Discord's UI.
 */

const $ = require('jquery');

class ElementRecord {

    constructor(name, selector) {
        this.name = name;
        this.selector = selector;
    }

    get jQuery() {
        return $(this.nodes);
    }

    get firstNode() {
        return document.querySelector(this.selector);
    }

    get nodes() {
        return document.querySelectorAll(this.selector);
    }

}

class ElementStore {

    get(element_name) {
        element_name = element_name.replace(/-/g, '_');

        const element_selector = this[element_name];

        if (!element_selector) throw new Error(`Unknown element ${element_name}`);
        if (element_selector instanceof ElementRecord) return element_selector;

        const element = new ElementRecord(element_name, element_selector);

        Object.defineProperty(this, element_name, {
            value: element,
            configurable: true
        });

        return element;
    }

    has(element_name) {
        element_name = element_name.replace(/-/g, '_');
        return !!this[element_name];
    }

}

ElementStore.ElementRecord = ElementRecord;

module.exports = ElementStore;
