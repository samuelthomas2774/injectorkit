/**
 * InjectorKit
 */

const Injection = require('../injection');

class OnceInjection extends Injection {

    static inject_at(injection, node, to_inject) {
        this.element.remove(injection, true);
    }

    // static uninject_at(injection, element, to_inject, injected) {
    //     injected.parentNode.removeChild(injected);
    // }

}

module.exports = OnceInjection;
