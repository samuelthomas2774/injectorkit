/**
 * InjectorKit
 */

import Injection from '../injection';

export default class OnceInjection extends Injection {
    static inject_at(injection, node, to_inject) {
        this.element.remove(injection, true);
    }

    // static uninject_at(injection, element, to_inject, injected) {
    //     injected.parentNode.removeChild(injected);
    // }
}
