import browser from 'webextension-polyfill';
import * as constants from './constants';

browser.contextMenus.create({
    id: constants.CONTEXT_MENU_ID,
    title: '坪単価を計算する',
    type: 'normal',
    contexts: ['selection'],
});

browser.contextMenus.onClicked.addListener(async (_, tab) => {
    const tabId = tab?.id;
    if (tabId == null) {
        return;;
    }

    browser.tabs.sendMessage(tabId!, { event: constants.EV_TRIGGER_TSUBO_CALCULATION });
});
