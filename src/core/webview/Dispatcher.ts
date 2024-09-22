import * as vscode from 'vscode';

/*
    or TransportDispatcher ?
*/

/*
    See: https://www.jsonrpc.org/specification
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

    sendDependencies<T = unknown>(dependencies: T) {
        this.webview.postMessage({ type: 'DEPENDENCIES', data: dependencies });
    }
}
