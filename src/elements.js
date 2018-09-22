/**
 * InjectorKit for Discord
 *
 * This file contains a list of elements in Discord's UI.
 */

export class ElementRecord {
    constructor(name, selector) {
        this.name = name;
        this.selector = selector;
    }

    get firstNode() {
        return document.querySelector(this.selector);
    }

    get nodes() {
        return document.querySelectorAll(this.selector);
    }
}

export default class ElementStore {
    get(element_name) {
        element_name = element_name.replace(/-/g, '_');

        const element_selector = this[element_name];

        if (!element_selector) throw new Error(`Unknown element ${element_name}`);
        if (element_selector instanceof ElementRecord) return element_selector;

        const element = new ElementRecord(element_name, element_selector);
        delete this[element_name];

        Object.defineProperty(this, element_name, {
            value: element,
            configurable: true,
        });

        return element;
    }

    has(element_name) {
        element_name = element_name.replace(/-/g, '_');
        return !!this[element_name];
    }

    static get ElementRecord() {
        return ElementRecord;
    }
}
