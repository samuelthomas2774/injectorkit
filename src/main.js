/**
 * InjectorKit for Discord
 */

const Element = require('./element');
const elements = require('./elements');

const $ = require('jquery');

const instances = {};
const watched_elements = {};

const observer = new MutationObserver(mutations => InjectorKit.mutationcallback(mutations));

let started = false;

// const added_nodes = [];

class InjectorKit {

    constructor(id) {
        if (id && instances[id])
            instances[id].unload();

        // Generate a new ID for this instance
        // This will be added to all injected elements
        this.id = id || 0;
        while (instances[this.id]) {
            this.id = Math.random();
        };

        instances[this.id] = this;

        this.element_instances = {};

        // Make sure InjectorKit has started - otherwise it won't be listening for mutations
        InjectorKit.start();
    }

    start() {
        this.started = true;
        $.each(this.element_instances, (key, element) => {
            element.start();
        });
    }

    stop() {
        this.started = false;
        $.each(this.element_instances, (key, element) => {
            element.stop();
        });
    }

    refresh() {
        $.each(this.element_instances, (key, element) => {
            element.refresh();
        });
    }

    get(element_name) {
        if (!elements[element_name.replace(/-/g, '_')])
            throw { message: `Unknown element ${element_name}.` };

        if(this.element_instances[element_name])
            return this.element_instances[element_name];

        let element = this.element_instances[element_name] = new Element(this, element_name, elements.get(element_name));

        if (this.started)
            element.start();

        return element;
    }

    unload() {
        // This function unbinds everything
        // Useful if a plugin is reloaded
        // This shouldn't be used to stop a plugin
        // See InjectorKit.stop for that

        $.each(this.element_instances, (name, element) => {
            element.unload();
            this.element_instances[name] = null;
            InjectorKit.instances[this.id] = null;
        });
    }

    static start() {
        if (started) return;
        started = true;

        observer.observe(elements.get('app').firstNode, {
            childList: true,
            subtree: true
        });
    }

    static refresh() {
        $.each(instances, (id, instance) => {
            instance.refresh();
        });
    }

    static mutationcallback(mutations) {
        $.each(mutations, (key, mutation) => {
            $.each(mutation.addedNodes, (key, node) => InjectorKit.addedNode(node, mutation));
        });
    }

    static addedNode(node, mutation) {
        if (node.nodeType !== 1)
            return;

        $.each(watched_elements, (element_name, elements_watching) => {
            if (elements_watching.length <= 0) return;

            var selector = elements.get(element_name).selector;
            let matched_elements;

            // if ($.inArray(node, added_nodes) > -1) return;
            // added_nodes.push(node);

            if (node.matches(selector)) {
                console.log(node, ' matches selector ', selector);
                $.each(elements_watching, (key, element) => {
                    console.log('exact', node, element, mutation);
                    element.refresh();
                });
            } else if ((matched_elements = node.querySelectorAll(selector)).length > 0) {
                console.log('child', matched_elements, ' matches selector ', selector);
                $.each(elements_watching, (key, element) => {
                    console.log('child', node, element, mutation);
                    element.refresh();
                });
            }
        });
    }

    static get instances() { return instances; }
    static get watched_elements() { return watched_elements; }

    static get elements() { return elements; }
    // static get c() { return added_nodes; }

}

module.exports = InjectorKit;
window.InjectorKit = InjectorKit;
