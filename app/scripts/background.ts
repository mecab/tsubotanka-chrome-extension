import browser from 'webextension-polyfill';
import * as constants from './constants';
import * as InjectionUtil from './InjectionUtil';

browser.contextMenus.create({
    id: constants.CONTEXT_MENU_ID,
    title: '坪単価を計算する',
    type: 'normal',
    contexts: ['selection'],
});

browser.contextMenus.onClicked.addListener(async (_, tab) => {
    const tabId = tab?.id;
    if (tabId == null) {
        return;
    }

    const [ { result: isInjected } = { result: false } ] = await browser.scripting.executeScript(
        {
            target: { tabId },
            func: InjectionUtil.isInjected,
        }
    );

    if (!isInjected) {
        console.log('injecting scripts');
        browser.scripting.insertCSS({
            target: { tabId },
            files: ['/styles/contentscript.css'],
        });

        await browser.scripting.executeScript({
            target: { tabId },
            files: ['/scripts/contentscript.js'],
        });
    }

    browser.tabs.sendMessage(tabId, { event: constants.EV_TRIGGER_TSUBO_CALCULATION });
});
