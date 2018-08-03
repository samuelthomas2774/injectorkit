/**
 * InjectorKit for Discord
 *
 * This file contains a list of elements in Discord's UI.
 */

const $ = require('jquery');

class ElementRecord {

    constructor(selector) {
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

class Elements {

    get(element_name) {
        element_name = element_name.replace(/-/g, '_');
        return new ElementRecord(this[element_name]);
    }

}

module.exports = new Elements();
