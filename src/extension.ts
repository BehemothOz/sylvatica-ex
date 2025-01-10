// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { WebviewPanelController } from './core/webview';
import { PackumentService } from './core/packument-service';
import { Sylvatica } from './sylvatica';

/*
    TODO: nx
    - Ignore packages that are using github or file urls
    - Check packageJsonVersion version (semver.validRange(packageJsonVersion))

    link: https://code.visualstudio.com/api/extension-guides/webview
*/

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "helloworld-sample 2" is now active!');

    const webviewController = new WebviewPanelController();
    /*
        TODO: clear after close
    */
    const packumentService = new PackumentService();

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('extension.helloWorld', async (file: vscode.Uri) => {
        // The code you place here will be executed every time your command is executed
        /*
            TODO: Add checks that the file is indeed packageJson
        */
        const webviewPanel = webviewController.create(context, file);

        try {
            const packumentCache = await packumentService.register(file.fsPath);

            const sylvatica = new Sylvatica(webviewPanel, packumentCache);

            await sylvatica.initialization(file);
            sylvatica.analyze();
        } catch (error) {
            console.error(error);
            vscode.window.showErrorMessage('Oops');
        }
    });

    context.subscriptions.push(disposable);
}
