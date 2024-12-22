import * as vscode from 'vscode';
import * as path from 'path';

import { Template } from './Template';
import { Dispatcher } from './Dispatcher';
import { Package } from '../package';

const DEFAULT_VIEW_COLUMN = vscode.ViewColumn.One;

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

export class WebviewPanelController {
    private currentPanel: WebviewPanel | null = null;

    create(context: vscode.ExtensionContext, environment: vscode.Uri) {
        if (this.currentPanel === null) {
            this.currentPanel = new WebviewPanel(context, environment);

            this.currentPanel.panel.onDidDispose(() => this.dispose(), null, context.subscriptions);
        } else {
            console.log('TEST::REVAL::Controller');
            this.currentPanel.panel.reveal(DEFAULT_VIEW_COLUMN);
        }

        return this.currentPanel;
    }

    /*
        Event is fired when a webview is destroyed (panel.dispose())
    */
    dispose() {
        console.log('TEST::DISPOSE::Controller');
        if (this.currentPanel) {
            this.currentPanel.panel.dispose();
            this.currentPanel = null;
        }
    }
}

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

    sendDependencies(packages: Package[]) {
        this.dispatcher.sendDependencies({
            title: 'Dependencies',
            data: packages,
        });
    }

    sendDevDependencies(packages: Package[]) {
        this.dispatcher.sendDependencies({
            title: 'Dev-Dependencies',
            data: packages,
        });
    }
}
