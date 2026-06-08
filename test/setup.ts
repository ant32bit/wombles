import * as fs from "fs";
import * as sinon from "sinon";
import { JSDOM } from "jsdom";

var indexHtml = fs.readFileSync('dist/www-root/index.html').toString();

export function initDOM() {
    const jsdom = new JSDOM(indexHtml);
    global.document = jsdom.window.document;
    global.window = global.document.defaultView!;
    global.navigator = window.navigator;

    global.Event = window.Event;
    global.KeyboardEvent = window.KeyboardEvent;
    global.MouseEvent = window.MouseEvent;
}
