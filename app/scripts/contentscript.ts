import browser from 'webextension-polyfill';
import EventEmitter from 'events';

import * as constants from './constants';
import { markAsInjected, isInjected } from './InjectionUtil';
import { UserInterface } from './UserInterface';

if (isInjected()) {
    throw new Error('Already injected. Stopping execution for safety.');
}

markAsInjected();

const event = new EventEmitter();
const ui = new UserInterface();

browser.runtime.onMessage.addListener((e: { event: string, data: any }) => {
    event.emit(e.event, e.data);
});

event.addListener(constants.EV_TRIGGER_TSUBO_CALCULATION, () => {
    ui.contextMenuFiredHandler();
});