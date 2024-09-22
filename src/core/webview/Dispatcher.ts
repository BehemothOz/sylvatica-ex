import * as vscode from 'vscode';

/*
    or TransportDispatcher ?
*/

/*
	notifyData
*/

export class Dispatcher {
    constructor(private webview: vscode.Webview) {}

    /*
		the initialization process has started
	*/
    initialization() {
        this.webview.postMessage({ type: 'INITIALIZATION' });
    }
}
