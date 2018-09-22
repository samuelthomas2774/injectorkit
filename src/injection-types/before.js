/**
 * InjectorKit
 */

import Injection from '../injection';

export default class BeforeInjection extends Injection {
    static inject_at(injection, node, to_inject) {
        const clone = to_inject.cloneNode(true);

        console.log(clone, 'before', node);

        node.parentNode.insertBefore(clone, node);

        return clone;
    }

    static uninject_at(injection, element, to_inject, injected) {
        injected.parentNode.removeChild(injected);
    }
}
