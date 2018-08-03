module.exports = (Plugin, Api, Vendor) => {
    const InjectorKit = require('../../');

    const { CssUtils } = Api;

    // const { $, moment } = Vendor;
    // const { Events } = Api;

    const injectorkit = new InjectorKit('testplugin');

    const menu = document.createElement('div');
    menu.classList.add('injectorkit-test', 'injectorkit-test-menu');
    menu.textContent = 'It works!';
    const menu_injection = injectorkit.get('search-bar').after(menu);

    return class extends Plugin {

        async onStart() {
            console.log('InjectorKit test plugin started.');
            injectorkit.start();

            CssUtils.injectStyle(`.injectorkit-test-menu {
                font-size: 15px;
                margin: 0px 8px;
            }
            .theme-light .injectorkit-test-menu {
                color: #4f545c;
            }`);
        }

        async onStop() {
            console.log('InjectorKit test plugin stopped.');
            injectorkit.stop();

            CssUtils.deleteAllStyles();
        }

        get injectorkit() {
            return injectorkit;
        }

        get InjectorKit() {
            return InjectorKit;
        }

        unload() {
            // Destroy InjectorKit when unloading so it can be started properly
            InjectorKit.destroy();

            delete require.cache[require.resolve('../../src/main')];
            delete require.cache[require.resolve('../../src/element')];
            delete require.cache[require.resolve('../../src/elements')];
        }

    }
};
