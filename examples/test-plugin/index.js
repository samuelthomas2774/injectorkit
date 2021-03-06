/* eslint no-unused-vars: "off" */

module.exports = (Plugin, Api, Vendor) => {
    const {default: InjectorKit} = require('../..');
    const ElementStore = require('../../elements/discord');

    const {CssUtils} = Api;

    const DiscordInjectorKit = InjectorKit.use(ElementStore);

    const injectorkit = new DiscordInjectorKit('testplugin');

    const menu = document.createElement('div');
    menu.classList.add('injectorkit-test', 'injectorkit-test-menu');
    menu.textContent = 'It works!';
    const menu_injection = injectorkit.get('search-bar').after(menu);

    return class extends Plugin {
        async onstart() {
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

        async onstop() {
            console.log('InjectorKit test plugin stopped.');
            injectorkit.stop();

            CssUtils.deleteAllStyles();
        }

        get injectorkit() {
            return injectorkit;
        }
        get DiscordInjectorKit() {
            return DiscordInjectorKit;
        }
        get InjectorKit() {
            return InjectorKit;
        }

        unload() {
            // Destroy InjectorKit when unloading so it can be started properly
            InjectorKit.destroy();

            delete require.cache[require.resolve('../../dist/index')];
            delete require.cache[require.resolve('../../dist/element')];
            delete require.cache[require.resolve('../../dist/injection')];
            delete require.cache[require.resolve('../../dist/elements')];

            delete require.cache[require.resolve('../../dist/injection-types/before')];
            delete require.cache[require.resolve('../../dist/injection-types/after')];
            delete require.cache[require.resolve('../../dist/injection-types/prepend')];
            delete require.cache[require.resolve('../../dist/injection-types/append')];
            delete require.cache[require.resolve('../../dist/injection-types/once')];
        }
    };
};
