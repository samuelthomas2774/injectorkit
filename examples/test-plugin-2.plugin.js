//META{"name":"TestPlugin2"}*//

/* eslint spaced-comment: "off" */

// Assuming the InjectorKit repo is in this directory
const {default: InjectorKit} = require('../../injectorkit');

// eslint-disable-next-line no-unused-vars
class TestPlugin2 {
    getName() {
        return 'Test Plugin 2';
    }
    getDescription() {
        return '';
    }
    getVersion() {
        return 1;
    }
    getAuthor() {
        return 'Samuel Elliott';
    }

    load() {
        this.injectorkit = new InjectorKit('test-plugin-2');
        this.loadInjections();
    }

    start() {
        console.log('InjectorKit test plugin started.');
        this.injectorkit.start();
        document.head.appendChild(this.styles);
    }

    stop() {
        console.log('InjectorKit test plugin stopped.');
        this.injectorkit.stop();
        if (this.styles.parentElement) this.styles.parentElement.removeChild(this.styles);
    }

    loadInjections() {
        this.menu = document.createElement('div');
        this.menu.classList.add('injectorkit-test');
        this.menu.classList.add('injectorkit-test-menu');
        this.menu.textContent = 'It works!';
        this.menu_injection = this.injectorkit.get('search-bar').after(this.menu);

        this.styles = document.createElement('style');
        this.styles.textContent = `.injectorkit-test-menu {
            font-size: 15px;
            margin: 0px 8px;
        }

        .theme-light .injectorkit-test-menu {
            color: #4f545c;
        }`;
    }
}
