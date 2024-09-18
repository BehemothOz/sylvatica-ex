// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { Sylvatica } from './sylvatica';

/*
    TODO: nx
    - Ignore packages that are using github or file urls
    - Check packageJsonVersion version (semver.validRange(packageJsonVersion))
*/

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "helloworld-sample" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('extension.helloWorld', async (file: vscode.Uri) => {
        // The code you place here will be executed every time your command is executed
        const sylvatica = new Sylvatica();

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.refresh', async () => {
            // WebPanel.kill();
            // WebPanel.createOrShow(context.extensionUri);
            // setTimeout(() => {
            //   vscode.commands.executeCommand(
            //     "workbench.action.webview.openDeveloperTools"
            //   );
            // }, 500);
        })
    );

    context.subscriptions.push(disposable);
}
