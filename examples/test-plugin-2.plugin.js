//META{"name":"TestPlugin2"}*//

// Assuming the InjectorKit repo is in this directory
const InjectorKit = require('../../injectorkit');

class TestPlugin2 {
    getName() { return "Test Plugin 2"; }
    getDescription() { return ""; }
    getVersion() { return 1; }
    getAuthor() { return "Samuel Elliott"; }

    load() {
        this.injectorkit = new InjectorKit('test-plugin-2');
        this.loadInjections();
    }

    start() {
        console.log('InjectorKit test plugin started.');
        this.injectorkit.start();
        this.$styles.appendTo('head');
    }

    stop() {
        console.log('InjectorKit test plugin stopped.');
        this.injectorkit.stop();
        this.$styles.detach();
    }

    loadInjections() {
        this.$menu = $('<div></div>').addClass('injectorkit-test injectorkit-test-menu').text('It works!');
        this.menu_injection = this.injectorkit.get('search_bar').after(this.$menu);

        this.$styles = $('<style></style>').text('.injectorkit-test-menu {\
            font-size: 15px;\
            margin: 0px 8px;\
        }\
        .theme-light .injectorkit-test-menu {\
            color: #4f545c;\
        }');
    }
}

module.exports = TestPlugin2;
