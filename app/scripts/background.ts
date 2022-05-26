import browser from 'webextension-polyfill';
import * as constants from './constants';
import * as InjectionUtil from './InjectionUtil';

type AnyFunc = (...args: any[]) => any;

function wrapFuncToCode<T extends () => any>(func: T): string;
function wrapFuncToCode<T extends AnyFunc>(func: T, args: Parameters<T>): string;
function wrapFuncToCode<T extends AnyFunc>(func: T, args: any[] = []): string
{
    return `(${func.toString()}).apply(this, ${JSON.stringify(args)})`;
}

async function executeScript<T extends () => any>(tabId: number, injection: { func: T }): Promise<ReturnType<T>>;
async function executeScript<T extends AnyFunc>(tabId: number, injection: { func: T, args: Parameters<T> }): Promise<ReturnType<T>>;
async function executeScript(tabId: number, injection: { file: string }): Promise<any>;
async function executeScript<T extends AnyFunc>(tabId: number, { func, args, file }: { func?: T, args?: any, file?: string }): Promise<ReturnType<T> | any> {
    let result: any;
    if (process.env['VENDOR'] === 'firefox') {
        (
            [ result ] = await browser.tabs.executeScript(tabId, {
                ... func ? { code : wrapFuncToCode(func, args) } : {},
                ... file ? { file } : {},
            })
        );
    } else {
        (
            [ { result } = { result: undefined } ] = await browser.scripting.executeScript({
                target: { tabId },
                ... func ? { func, args } : {},
                ... file ? { files: [ file ] } : {},
            })
        );
    }
    
    return result as ReturnType<T>;
}

async function insertCSS(tabId: number, file: string) {
    if (process.env['VENDOR'] === 'firefox') {
        browser.tabs.insertCSS(tabId, { file });
    } else {
        browser.scripting.insertCSS({
            target: { tabId },
            files: [ file ],
        });
    }
}

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

    const isInjected = await executeScript(tabId, {
        func: InjectionUtil.isInjected,
    });
    

    if (!isInjected) {
        console.log('injecting scripts');

        insertCSS(tabId, '/styles/contentscript.css');
        
        await executeScript(tabId, { file: '/scripts/contentscript.js' });
    }

    browser.tabs.sendMessage(tabId, { event: constants.EV_TRIGGER_TSUBO_CALCULATION });
});
