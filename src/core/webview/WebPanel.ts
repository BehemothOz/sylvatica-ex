import * as vscode from 'vscode';

import { Template } from './Template';

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

    create(context: vscode.ExtensionContext) {
        if (this.currentPanel === null) {
            this.currentPanel = new WebviewPanel(context);
        }

        return this.currentPanel;
    }
}

export class WebviewPanel {
    panel: vscode.WebviewPanel;
    template: Template;

    constructor(context: vscode.ExtensionContext) {
        this.panel = vscode.window.createWebviewPanel('sylvatica', 'Sylvatica Packages', DEFAULT_VIEW_COLUMN, {
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

        // And set its HTML content
        this.panel.webview.html = this.template.getContent();

        // Event is fired when a webview is destroyed (panel.dispose())
        this.panel.onDidDispose(
            () => {
                // When the panel is closed, cancel any future updates to the webview content
                // clearInterval(interval);
                console.log('Call onDidDispose');
            },
            null,
            context.subscriptions
        );

        // Whenever a webview's visibility changes, or when a webview is moved into a new column, the onDidChangeViewState event is fired.
        this.panel.onDidChangeViewState(e => {
            const panel = e.webviewPanel;
            console.log(panel);
        });
    }
}
