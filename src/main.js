/**
 * InjectorKit for Discord
 */

const Element = require('./element');
const ElementStore = require('./elements');

const ElementRecord = ElementStore.ElementRecord;

const instances = {};
const watched_elements = Element.watched_elements;

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
        }

        instances[this.id] = this;

        this.element_instances = {};

        // Make sure InjectorKit has started - otherwise it won't be listening for mutations
        InjectorKit.start();
    }

    static use(...element_stores) {
        const ParentInjectorKit = this;

        return class extends ParentInjectorKit {
            static get parent() { return ParentInjectorKit; }
            static get element_stores() { return element_stores; }
        }
    }

    start() {
        this.started = true;
        for (let element of this.element_instances) {
            element.start();
        }
    }

    stop() {
        this.started = false;
        for (let element of this.element_instances) {
            element.stop();
        }
    }

    refresh() {
        for (let element of this.element_instances) {
            element.refresh();
        }
    }

    get(element_name) {
        const element_record = element_name instanceof ElementRecord ? element_name : this.constructor.getElementRecord(element_name);

        if (this.element_instances.has(element_record))
            return this.element_instances.get(element_record);

        const element = new Element(this, element_record);
        this.element_instances.set(element_record, element);

        if (this.started) element.start();

        return element;
    }

    unload() {
        // This function unbinds everything
        // Useful if a plugin is reloaded
        // This shouldn't be used to stop a plugin
        // See InjectorKit.stop for that

        for (let element of this.element_instances) {
            element.unload();
            delete this.element_instances[name];
        }
        delete InjectorKit.instances[this.id];
    }

    static start() {
        if (started) return;
        started = true;

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    static refresh() {
        for (let instance of instances) {
            instance.refresh();
        }
    }

    static destroy() {
        for (let instance of instances) {
            instance.unload();
        }

        observer.disconnect();
    }

    static mutationcallback(mutations) {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                InjectorKit.addedNode(node, mutation);
            }
        }
    }

    static addedNode(node, mutation) {
        if (node.nodeType !== 1)
            return;

        for (let [element_name, elements_watching] of Object.entries(watched_elements)) {
            if (elements_watching.length <= 0) return;

            var selector = elements.get(element_name).selector;
            let matched_elements;

            // if ($.inArray(node, added_nodes) > -1) return;
            // added_nodes.push(node);

            if (node.matches(selector)) {
                console.log(node, 'matches selector', selector);

                for (let element of elements_watching) {
                    console.log('exact', node, element, mutation);
                    element.refresh();
                }
            } else if ((matched_elements = node.querySelectorAll(selector)).length > 0) {
                console.log('child', matched_elements, 'matches selector', selector);

                for (let element of elements_watching) {
                    console.log('child', node, element, mutation);
                    element.refresh();
                }
            }
        }
    }

    static getElementRecord(element_name) {
        element_name = element_name.replace(/-/g, '_');

        for (let element_store of this.element_stores) {
            if (element_store.has(element_name)) return element_store.get(element_name);
        }

        if (this.parent) return this.parent.getElementRecord(element_name);

        // If we get here then the element doesn't exist
        throw new Error(`Unknown element ${element_name}`);
    }

    static get instances() { return instances; }
    static get watched_elements() { return watched_elements; }

    static get elements() { return elements; }
    // static get c() { return added_nodes; }

}

module.exports = InjectorKit;
window.InjectorKit = InjectorKit;
