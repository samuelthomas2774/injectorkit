/**
 * InjectorKit
 */

import Injection from '../injection';

export default class PrependInjection extends Injection {
    static inject_at(injection, element, to_inject) {
        const clone = to_inject.cloneNode(true);

        console.log(clone, 'prepend', element);

        element.insertBefore(clone, element.firstChild);

        return clone;
    }

    static uninject_at(injection, element, to_inject, injected) {
        injected.parentNode.removeChild(injected);
    }
}
