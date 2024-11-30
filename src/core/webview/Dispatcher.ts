import * as vscode from 'vscode';

/*
    See: https://www.jsonrpc.org/specification
	notifyData
*/
export class Dispatcher {
    constructor(private webview: vscode.Webview) {}

    /*
		Initialization process has started
	*/
    initialization() {
        this.webview.postMessage({ type: 'INITIALIZATION' });
    }

    sendDependencies<T = unknown>(payload: T) {
        this.webview.postMessage({ type: 'DEPENDENCIES', data: payload });
    }

    sendDevDependencies<T = unknown>(payload: T) {
        this.webview.postMessage({ type: 'DEV_DEPENDENCIES', data: payload });
    }

    notifyPackageManagerReady() {
        this.webview.postMessage({ type: 'PACKAGE_MANAGER_DETECTED' });
    }
}
