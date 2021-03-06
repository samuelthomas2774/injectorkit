/**
 * InjectorKit
 */

import Element, {watched_elements} from './element';
import ElementStore, {ElementRecord} from './elements';
import Injection from './injection';

const instances = {};

const observer = new MutationObserver(mutations => InjectorKit.mutationcallback(mutations));

let started = false;

class InjectorKit {
    constructor(id) {
        if (id && instances[id]) {
            instances[id].unload();
        }

        // Generate a new ID for this instance
        // This will be added to all injected elements
        this.id = id || 0;
        while (instances[this.id]) {
            this.id = Math.random();
        }

        instances[this.id] = this;

        this.element_instances = new Map();

        // Make sure InjectorKit has started - otherwise it won't be listening for mutations
        InjectorKit.start();
    }

    static use(...element_stores) {
        const ParentInjectorKit = this;

        return class extends ParentInjectorKit {
            static get parent() {
                return ParentInjectorKit;
            }
            static get element_stores() {
                return element_stores;
            }
        };
    }

    /**
     * Enable all this instance's injections.
     */
    start() {
        this.started = true;
        for (let element of this.element_instances.values()) {
            element.start();
        }
    }

    /**
     * Disable all this instance's injections.
     */
    stop() {
        this.started = false;
        for (let element of this.element_instances.values()) {
            element.stop();
        }
    }

    /**
     * Refresh all this instance's injections.
     */
    refresh() {
        for (let element of this.element_instances.values()) {
            element.refresh();
        }
    }

    /**
     * Returns an Element.
     *
     * @param {string} element_name
     * @return {Element}
     */
    get(element_name) {
        const element_record = element_name instanceof ElementRecord ? element_name :
            this.constructor.getElementRecord(element_name);

        if (this.element_instances.has(element_record)) {
            return this.element_instances.get(element_record);
        }

        const element = new Element(this, element_record);
        this.element_instances.set(element_record, element);

        if (this.started) element.start();

        return element;
    }

    /**
     * This function unbinds everything.
     * Useful if a plugin is reloaded.
     * This shouldn't be used to stop a plugin.
     * See {@link InjectorKit.stop} for that.
     */
    unload() {
        for (let [name, element] of this.element_instances) {
            element.unload();
            this.element_instances.delete(name);
        }

        delete instances[this.id];
    }

    static start() {
        if (this !== InjectorKit) return InjectorKit.start();

        if (started) return;
        started = true;

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
    }

    static refresh() {
        for (let instance of instances) {
            instance.refresh();
        }
    }

    static destroy() {
        if (this !== InjectorKit) return InjectorKit.destroy();

        started = false;

        for (let instance of Object.values(instances)) {
            instance.unload();
        }

        observer.disconnect();
    }

    static mutationcallback(mutations) {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                InjectorKit.addedNode(node, mutation);
            }

            for (let node of mutation.removedNodes) {
                InjectorKit.removedNode(node, mutation);
            }
        }
    }

    static addedNode(node, mutation) {
        const matches = this.getMatchingElements(node, mutation);
        for (let {element, node} of matches) {
            element.addedNode(node);
        }
    }

    static removedNode(node, mutation) {
        const matches = this.getMatchingElements(node, mutation);
        for (let {element, node} of matches) {
            element.removedNode(node);
        }
    }

    static getMatchingElements(node, mutation) {
        const matches = [];

        if (node.nodeType !== 1) return matches;

        for (let [element_record, elements] of watched_elements) {
            if (elements.length <= 0) return matches;

            if (node.matches(element_record.selector)) {
                console.log(node, 'matches selector', element_record.selector);

                for (let element of elements) {
                    console.log('exact', node, element, mutation);
                    matches.push({
                        exact: true,
                        element,
                        node,
                    });
                }

                // eslint-disable-next-line curly
            } else for (let matched_node of node.querySelectorAll(element_record.selector)) {
                console.log('child', matched_node, 'matches selector', element_record.selector);

                for (let element of elements) {
                    console.log('child', node, element, mutation);
                    matches.push({
                        exact: false,
                        element,
                        node: matched_node,
                    });
                }
            }
        }

        return matches;
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

    static get instances() {
        return instances;
    }

    static get types() {
        return Injection.types;
    }
}

export default InjectorKit;
export {ElementStore};
