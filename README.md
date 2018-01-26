InjectorKit for Discord
===

This is a library for building plugins for BetterDiscord. It finds elements of Discord's UI so if something changes only this library needs to be updated. It also automatically re-injects elements if needed.

Usage
---

The main function you'll use is the `InjectorKit.get` function. It returns an `Element` object, which contains functions to add content before, after or inside that element.

```js
const InjectorKit = require('injectorkit');
const injectorkit = new InjectorKit();

injectorkit.start();

// Add a menu above the user details panel
const $menu = $('<div></div>').addClass('injectorkit-test');
const injection = injectorkit.get('user-details').before($menu);

```

### In a plugin

This library is built specifically for BetterDiscord plugins, and has some functions to make it's use easier in plugins. In most cases an InjectorKit instance should be created with an ID. If a new instance is created with the same ID, the old one will be automatically destroyed.

```js
onLoad() {
    this.injectorkit = new InjectorKit('plugin-id');
}

onStart() {
    // The start function starts all injections
    this.injectorkit.start();
}

onStop() {
    // The stop function removes all injections
    this.injectorkit.stop();
}

```

### Using callbacks

You can add callbacks to catch when exactly something is injected/removed. (Note: when an element of Discord's UI is itself removed there will be no callback.) You can in a callback change properties of each instance of the element to inject, or remove if needed. You can also create an injection with only a callback.

```js
const $menu = $('<div></div>').addClass('injectorkit-test');
injectorkit.get('channel-list-channels').prepend($menu, (injection, $element, $injected) => {
    // injection is the injection record (the same is returned by InjectorKit.prepend)
    // $element is a jQuery object containing the element of Discord's UI
    // $injected is a jQuery object containing the element that was injected
    // This function will be called individually for each element that is injected (remember that injections are continuous - if any more channels are added to the list $menu will be prepended and this will be called again)
    
    console.log('Injected ', $injected);
}, (injection, $element, $uninjected) {
    // Arguments are the same as above
    
    console.log('Removed ', $uninjected);
});

```

Available elements
---

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
tooltips        | .tooltips                 |
tooltip         | .tooltips > *             |

InjectorKit only works with elements inside of the app element (`#app-mount`). If you want to inject CSS, use this:

```js
const $styles = $('<style></style>').text(your_css);

// On plugin start
$styles.appendTo('head');

// On plugin stop
$styles.detach();

```
