/**
 * InjectorKit
 */

import Injection from '../injection';

export default class AppendInjection extends Injection {
    static inject_at(injection, node, to_inject) {
        const clone = to_inject.cloneNode(true);

        console.log(clone, 'append', node);

        node.insertBefore(clone, null);

        return clone;
    }

    static uninject_at(injection, element, to_inject, injected) {
        injected.parentNode.removeChild(injected);
    }
}
