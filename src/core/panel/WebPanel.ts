import * as vscode from 'vscode';

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

export class WebPanel {
    constructor(context: vscode.ExtensionContext) {
        const panel = vscode.window.createWebviewPanel('sylvatica', 'Sylvatica Packages', DEFAULT_VIEW_COLUMN, {
            // Only allow the webview to access resources in our extension's media directory
            localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')],
        });

        // And set its HTML content
        panel.webview.html = getWebviewContent();

        // Event is fired when a webview is destroyed (panel.dispose())
        panel.onDidDispose(
            () => {
                // When the panel is closed, cancel any future updates to the webview content
                // clearInterval(interval);
                console.log('Call onDidDispose');
            },
            null,
            context.subscriptions
        );

        // Whenever a webview's visibility changes, or when a webview is moved into a new column, the onDidChangeViewState event is fired.
        panel.onDidChangeViewState(e => {
            const panel = e.webviewPanel;
            console.log(panel);
        });

        console.log("panel.webview.cspSource", panel.webview.cspSource);
    }
}

function getWebviewContent() {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cat Coding</title>
  </head>
  <body>
    <h1>Hello</h1>
    <h1 id="lines-of-code-counter">0</h1><h1 id="lines-of-code-counter">0</h1>
    <script>
        const vscode = acquireVsCodeApi();

        const counter = document.getElementById('lines-of-code-counter');

        const previousState = vscode.getState();

        let count = previousState ? previousState.count : 0;
        counter.textContent = count;

        let count = 0;
        setInterval(() => {
            counter.textContent = count++;
            // Update the saved state
            vscode.setState({ count });
        }, 100);
    </script>
  </body>
  </html>`;
}
