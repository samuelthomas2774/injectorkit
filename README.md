InjectorKit
===

InjectorKit is a library for hooking into web applications. It stores elements' selectors so if something changes only the elements library needs to be updated. It also automatically re-injects elements if needed.

InjectorKit was originally made for use by plugins for BetterDiscord, and comes with elements for Discord's UI by default.

Usage
---

The main function you'll use is the `InjectorKit.get` function. It returns an `Element` object, which contains functions to add content before, after or inside that element.

```js
import InjectorKit from 'injectorkit';
import DiscordElements from 'injectorkit/elements/discord';
// or
const InjectorKit = require('injectorkit');
const DiscordElements = require('injectorkit/elements/discord');

const DiscordInjectorKit = InjectorKit.use(DiscordElements);
const injectorkit = new DiscordInjectorKit();

injectorkit.start();

// Add a menu above the user details panel
const menu = document.createElement('div');
menu.classList.add('injectorkit-test');

const injection = injectorkit.get('user-details').before(menu);

```

### In a BetterDiscord plugin

For BetterDiscord v2, you can use InjectorKit as an external module. Just add `"injectorkit": "^2.0.0"` to the your plugin's dependencies.

```json
{
    "...": "...",
    "dependencies": {
        "injectorkit": "^2.0.0"
    }
}

```

```js
export default (Plugin, PluginApi, Dependencies) => {
    const DiscordInjectorKit = Dependencies.injectorkit.default;

    // ...

    return class MyPlugin extends Plugin {
        onstart() {
            if (!this.injectorkit) this.injectorkit = new InjectorKit(this.id);

            this.injectorkit.start();
        }

        onstop() {
            this.injectorkit.stop();
        }

        onunload() {
            this.injectorkit.unload();
        }

        // ...
    }
};

```

### Using callbacks

You can add callbacks to catch when exactly something is injected/removed. (Note: when an element is itself removed there will be no callback.) You can in a callback change properties of each instance of the element to inject, or remove if needed. You can also create an injection with only a callback.

```js
const menu = document.createElement('div');
menu.classList.add('injectorkit-test');

injectorkit.get('channel-list-channels').prepend(menu, (injection, element, injected) => {
    // injection is the injection record (the same is returned by InjectorKit.prepend)
    // element is the element
    // injected is the element that was injected (a clone of menu)
    // This function will be called individually for each element that is injected (remember that injections are continuous - if any more channels are added to the list $menu will be prepended and this will be called again)

    console.log('Injected ', injected);
}, (injection, element, uninjected) => {
    // Arguments are the same as above

    console.log('Removed ', uninjected);
});

```

### Using Element.once

You can use the `Element.once` function to wait for an element to be added to the DOM.

```js
injectorkit.get('preferences-sidebar').once((injection, element) => {
    // injection is the injection record
    // element is the element
});

```

If you don't specify a callback, any matching element that is already in the DOM will be ignored and a promise will be returned.

```js
const element = await injectorkit.get('preferences-sidebar').once();

```

Available elements
---

### Discord

Not that much *yet*.

Name            | CSS Selector              | Notes
----------------|---------------------------|---
app             | #app-mount                | The root element Discord is mounted at
server-list     | .guilds-wrapper           |
user-details    | .container-iksrDt         | The user details panel at the bottom of the channel list
search-bar      | .search-2--6aU            |
channel-list-channel | .channels-3g2vYe .containerDefault-7RImuF, .channels-3g2vYe .containerDragAfter-3rB7mB, .channels-3g2vYe .containerDragBefore-12YyA9, .channels-3g2vYe .containerUserOver-2YhVL6 |
messages        | .messages-wrap            |
message         | .message-group            | A message (this includes messages that have been collapsed into a single container)
member-list     | .channel-members-wrap     |
member-list-member | .channel-members-wrap .member |
preferences     | .layer-kosS71             | The user/app settings layer
preferences-sidebar | .layer-kosS71 .side-2nYO0F |
modal           | .modal-2LIEKY             |
modal-help      | .modal-2LIEKY .need-help-modal |
modal-addserver | .modal-2LIEKY .create-guild-container |
modal-addserver-createjoin | .modal-2LIEKY .create-guild-container > .create-or-join |
modal-addserver-create | .modal-2LIEKY .create-guild-container > .create-guild |
modal-addserver-join | .modal-2LIEKY .create-guild-container > .join-server |
tooltips        | .tooltips                 |
tooltip         | .tooltips > *             |
