/**
 * InjectorKit
 */

import Injection from '../injection';

export default class AfterInjection extends Injection {
    static inject_at(injection, node, to_inject) {
        const clone = to_inject.cloneNode(true);

        console.log(clone, 'after', node);

        node.parentNode.insertBefore(clone, node.nextSibling);

        return clone;
    }

    static uninject_at(injection, node, to_inject, injected) {
        injected.parentNode.removeChild(injected);
    }
}
