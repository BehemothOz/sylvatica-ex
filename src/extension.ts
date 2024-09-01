// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

import { fm } from './core/FileManager';

import { PackageManagerDetector } from './core/detecter';
import { PackageJsonReader } from './core/PackageJsonReader';

import { Sylvatica } from './sylvatica';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "helloworld-sample" is now active!');

    const packageManagerDetector = new PackageManagerDetector();

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('extension.helloWorld', async (file: vscode.Uri) => {
        // The code you place here will be executed every time your command is executed
        const sylvatica = new Sylvatica();
        const directoryPath = path.dirname(file.fsPath);

        const json = await PackageJsonReader.read(file);

        /*
            Get installed dependencies version
        */
        const { dependencies } = json;
        const moduleNames = Object.keys(dependencies);

        for (const moduleName of moduleNames) {
            const directoryPathAsUri = vscode.Uri.file(directoryPath);
            // const localNodeModules = fm.joinPath(directoryPathAsUri, 'node_modules');
            const packageJsonPath = fm.joinPath(directoryPathAsUri, 'node_modules', moduleName, 'package.json');

            if (fm.exist(packageJsonPath)) {
                try {
                    const packageJsonModule = await PackageJsonReader.read(packageJsonPath);
                    console.log(moduleName, packageJsonModule.version);
                } catch (e) {
                    console.log(e);
                }
            }
        }

        const result = await sylvatica.init(moduleNames.map((_, idx) => idx + 1));
        console.log(result);

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
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
