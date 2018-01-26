module.exports = (Plugin, Api, Vendor) => {
    const $ = require('jquery');
    const InjectorKit = require('../../');

    // const { $, moment } = Vendor;
    // const { Events } = Api;

    const injectorkit = new InjectorKit('testplugin');

    const $menu = $('<div></div>').addClass('injectorkit-test injectorkit-test-menu').text('It works!');
    const menu_injection = injectorkit.get('search-bar').after($menu);

    const $styles = $('<style></style>').text('.injectorkit-test-menu {\
        font-size: 15px;\
        margin: 0px 8px;\
    }\
    .theme-light .injectorkit-test-menu {\
        color: #4f545c;\
    }');

    return class extends Plugin {

        async onStart() {
            console.log('InjectorKit test plugin started.');
            injectorkit.start();
            $styles.appendTo('head');
            return true;
        }

        async onStop() {
            console.log('InjectorKit test plugin stopped.');
            injectorkit.stop();
            $styles.detach();
            return false;
        }

    }
};
