/**
 * InjectorKit for Discord
 */

const {ElementStore} = require('..');

class DiscordElements extends ElementStore {

    get app() { return '#app-mount'; }

    get server_list() { return '.guilds-wrapper'; }

    get user_details() { return '.container-iksrDt'; }

    get search_bar() { return '.da-search'; }

    get channel_list_channel() {
        var selector = '';
        selector += '.channels-3g2vYe .containerDefault-7RImuF,';
        selector += '.channels-3g2vYe .containerDragAfter-3rB7mB,';
        selector += '.channels-3g2vYe .containerDragBefore-12YyA9,';
        selector += '.channels-3g2vYe .containerUserOver-2YhVL6';
        return selector;
    }

    get messages() { return '.messages-wrap'; }
    get message() { return '.message-group'; }

    get member_list() { return '.channel-members-wrap'; }
    get member_list_member() { return '.channel-members-wrap .member'; }

    get preferences() { return '.layer-kosS71'; }
    get preferences_sidebar() { return '.layer-kosS71 .side-2nYO0F'; }

    get modal() { return '.modal-2LIEKY'; }
    get modal_help() { return '.modal-2LIEKY .need-help-modal'; }
    get modal_addserver() { return '.modal-2LIEKY .create-guild-container'; }
    get modal_addserver_createjoin() { return '.modal-2LIEKY .create-guild-container > .create-or-join'; }
    get modal_addserver_create() { return '.modal-2LIEKY .create-guild-container > .create-guild'; }
    get modal_addserver_join() { return '.modal-2LIEKY .create-guild-container > .join-server'; }

    get tooltips() { return '.tooltips'; }
    get tooltip() { return '.tooltips > *'; }

}

module.exports = new DiscordElements();
