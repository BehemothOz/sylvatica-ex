// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { Sylvatica } from './sylvatica';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "helloworld-sample" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('extension.helloWorld', async () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');

        WebPanel.createOrShow(context.extensionUri);

        const sylvatica = new Sylvatica();
        const r = await sylvatica.init();
        console.log(r);

        WebPanel.currentPanel?.sendMessage(r);

        console.log('----------------- end');
    });

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.refresh', async () => {
            WebPanel.kill();
            WebPanel.createOrShow(context.extensionUri);
            // setTimeout(() => {
            //   vscode.commands.executeCommand(
            //     "workbench.action.webview.openDeveloperTools"
            //   );
            // }, 500);
        })
    );

    context.subscriptions.push(disposable);
}

class WebPanel {
    public static currentPanel: WebPanel | undefined;

    public static readonly viewType = 'aaa';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

        // If we already have a panel, show it.
        if (WebPanel.currentPanel) {
            WebPanel.currentPanel._panel.reveal(column);
            return;
        }

        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(WebPanel.viewType, 'Panel Title', vscode.ViewColumn.One, {
            enableScripts: true,
        });

        WebPanel.currentPanel = new WebPanel(panel, extensionUri);
    }

    public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        WebPanel.currentPanel = new WebPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        // Set the webview's initial html content
        this._update();

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Update the content based on view changes
        this._panel.onDidChangeViewState(
            e => {
                if (this._panel.visible) {
                    this._update();
                }
            },
            null,
            this._disposables
        );
    }

    public sendMessage(data: any) {
        this._panel.webview.postMessage({ payload: data });
    }

    public dispose() {
        WebPanel.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    public static kill() {
        WebPanel.currentPanel?.dispose();
        WebPanel.currentPanel = undefined;
    }

    private _update() {
        const webview = this._panel.webview;

        // Vary the webview's content based on where it is located in the editor.
        switch (this._panel.viewColumn) {
            case vscode.ViewColumn.One:
            default:
                this._updateForCat(webview);
                return;
        }
    }

    private _updateForCat(webview: vscode.Webview) {
        this._panel.title = '123';
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // Local path to main script run in the webview
        console.log(this._extensionUri.path);
        const scriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'src', 'client', 'dist', 'main.js');

        // And the uri we use to load this script in the webview
        const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<title>Title 1</title>
			</head>
			<body>
				<h1>1</h1>
                <div id="root"></div>

				<script src="${scriptUri}"></script>
			</body>
			</html>`;
    }
}
