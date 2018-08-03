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

        if (this.element.started && !this.ignore_current_elements)
            this.inject();
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
        return Injection.inject_at(this.type, this, node, this.to_inject);
    }

    static inject_at(type, injection, node, to_inject) {
        if (!this['inject_at_' + type]) return;
        return this['inject_at_' + type](injection, node, to_inject);
    }

    static inject_at_before(injection, element, to_inject) {
        console.log(to_inject, 'before', element);

        to_inject = to_inject.cloneNode(true);
        element.parentNode.insertBefore(to_inject, element);
        return to_inject;
    }

    static inject_at_after(injection, element, to_inject) {
        // return $to_inject.insertAfter($element);

        console.log(to_inject, 'after', element);

        to_inject = to_inject.cloneNode(true);
        element.parentNode.insertBefore(to_inject, element.nextSibling);
        return to_inject;
    }

    static inject_at_prepend(injection, $element, $to_inject) {
        return $to_inject.prependTo($element);
    }

    static inject_at_append(injection, $element, $to_inject) {
        return $to_inject.appendTo($element);
    }

    static inject_at_once(injection, $element, $to_inject) {
        this.remove(injection.id, true);
    }

    uninject_at(node, injected) {
        return Injection.uninject_at(this.type, this, node, this.to_inject, injected);
    }

    static uninject_at(type, injection, node, to_inject, injected) {
        if (!this['uninject_at_' + type]) return;
        return this['uninject_at_' + type](injection, node, to_inject, injected);
    }

    static uninject_at_before(injection, element, to_inject, injected) {
        injected.parentNode.removeChild(injected);
    }

    static uninject_at_after(injection, element, to_inject, injected) {
        injected.parentNode.removeChild(injected);
    }

    static uninject_at_prepend(injection, $element, $to_inject, $to_uninject) {
        $to_uninject.detach();
    }

    static uninject_at_append(injection, $element, $to_inject, $to_uninject) {
        $to_uninject.detach();
    }

}

module.exports = Injection;
