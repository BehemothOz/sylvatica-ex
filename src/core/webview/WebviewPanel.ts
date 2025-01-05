import * as vscode from 'vscode';
import * as path from 'path';

import { Template } from './Template';
import { Dispatcher } from './Dispatcher';
import { type PackageType } from '../package';

export const DEFAULT_VIEW_COLUMN = vscode.ViewColumn.One;

/*
    Commands:
    Developer: Reload Webview
*/

/*
    Context menus (right-click)
    https://code.visualstudio.com/api/extension-guides/webview#context-menus

    Messages
    https://code.visualstudio.com/api/extension-guides/webview#passing-messages-from-an-extension-to-a-webview
*/

/*
    .reveal(column); - restore panel
*/

/*
    <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'none'; img-src ${webview.cspSource} https:; script-src ${webview.cspSource}; style-src ${webview.cspSource};"
    />

    const scriptPathOnDisk = vscode.Uri.joinPath(this.extensionUri, ..., 'main.js');
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
*/

/*
    retainContextWhenHidden  - todo
*/
export class WebviewPanel {
    panel: vscode.WebviewPanel;
    template: Template;
    private dispatcher: Dispatcher;

    /*
        TODO: panel.title = "new title" + updateWebview function
    */
    constructor(context: vscode.ExtensionContext, environment: vscode.Uri) {
        const tabTitle = path.dirname(environment.fsPath);

        this.panel = vscode.window.createWebviewPanel('sylvatica', tabTitle, DEFAULT_VIEW_COLUMN, {
            // Only allow the webview to access resources in our extension's media directory
            // localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')],
            // ...
            enableScripts: true,
        });

        this.template = new Template({
            title: 'Unknown',
            extensionUri: context.extensionUri,
            webview: this.panel.webview,
        });

        this.dispatcher = new Dispatcher(this.panel.webview);

        // And set its HTML content
        this.panel.webview.html = this.template.getContent();

        // Whenever a webview's visibility changes, or when a webview is moved into a new column, the onDidChangeViewState event is fired.
        this.panel.onDidChangeViewState((e) => {
            const panel = e.webviewPanel;
            console.log(panel);
        });
    }

    initialization() {
        this.dispatcher.initialization();
    }

    sendDependencies(packages: PackageType[]) {
        this.dispatcher.sendDependencies({
            title: 'Dependencies',
            packages: packages,
        });
    }

    sendDevDependencies(packages: PackageType[]) {
        this.dispatcher.sendDevDependencies({
            title: 'Dev-Dependencies',
            packages,
        });
    }
}
