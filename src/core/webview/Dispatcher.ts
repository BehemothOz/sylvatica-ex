import * as vscode from 'vscode';
import { type PackageType } from '../package';

/*
    See: https://www.jsonrpc.org/specification
	notifyData
*/

interface DependenciesPayload {
    title: string;
    packages: Array<PackageType>;
}

export class Dispatcher {
    constructor(private webview: vscode.Webview) {}

    /*
		Initialization process has started
	*/
    initialization() {
        this.webview.postMessage({ type: 'INITIALIZATION' });
    }

    sendDependencies(payload: DependenciesPayload) {
        this.webview.postMessage({ type: 'DEPENDENCIES', payload });
    }

    sendDevDependencies(payload: DependenciesPayload) {
        this.webview.postMessage({ type: 'DEV_DEPENDENCIES', payload });
    }

    notifyPackageManagerReady() {
        this.webview.postMessage({ type: 'PACKAGE_MANAGER_DETECTED' });
    }

    notifyError(payload: string) {
        this.webview.postMessage({ type: 'ERROR_DETECTED', payload });
    }
}
