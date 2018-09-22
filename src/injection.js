/**
 * InjectorKit
 */

const node_injection_map = new WeakMap();

class Injection {
    constructor(element, data) {
        Object.assign(this, data);
        this.element = element;

        do {
            this.id = Math.random();
        } while (this.element.injections.find(i => i.id === this.id));

        this.injected = [];
        this.injected_nodes = new WeakMap();

        this.element.injections.push(this);

        if (this.element.started && !this.ignore_current_elements) {
            this.inject();
        }
    }

    inject() {
        this.started = true;

        for (let node of this.element.nodes) {
            this.injectNode(node);
        }
    }

    injectNode(node) {
        if (this.injected_nodes.has(node)) return;

        let injected;

        // injected = Injection.inject_at(this.type, this, node, this.to_inject);
        injected = this.inject_at(node);
        if (injected) node_injection_map.set(injected, this);

        if (this.inject_callback) this.inject_callback(this, node, injected);

        this.injected_nodes.set(node, injected);
    }

    uninject() {
        console.log('Uninjecting ', this.to_inject, ' ', this.type, ' ', this.element.nodes);

        for (let node of this.element.nodes) {
            this.uninjectNode(node);
        }

        this.started = false;
    }

    uninjectNode(node) {
        if (!this.injected_nodes.has(node)) return;

        let injected = this.injected_nodes.get(node);

        if (this.uninject_callback) this.uninject_callback(this, node, injected);

        // Injection.uninject_at(this.type, this, node, this.to_inject, injected);
        this.uninject_at(node, injected);
        node_injection_map.delete(injected);

        this.injected_nodes.delete(node);
    }

    refresh() {
        this.uninject();
        this.inject();
    }

    inject_at(node) {
        return this.constructor.inject_at(this, node, this.to_inject);
    }

    static inject_at(injection, node, to_inject) {
        if (!this['inject_at_' + injection.type]) return;
        return this['inject_at_' + injection.type](injection, node, to_inject);
    }

    uninject_at(node, injected) {
        return this.constructor.uninject_at(this, node, this.to_inject, injected);
    }

    static createInjection(element, injection, type) {
        const InjectionType = Injection.types[type || injection.type];
        if (!InjectionType) throw new Error(`Unknown injection type ${type || injection.type}`);
        return new InjectionType(element, injection);
    }
}

Injection.types = new class {
    get before() {
        return require('./injection-types/before').default;
    }
    get after() {
        return require('./injection-types/after').default;
    }
    get prepend() {
        return require('./injection-types/prepend').default;
    }
    get append() {
        return require('./injection-types/append').default;
    }
    get once() {
        return require('./injection-types/once').default;
    }
};

export default Injection;
