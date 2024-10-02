// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

import { Sylvatica } from './sylvatica';
import { LocalDependenciesManager } from './core/LocalDependenciesManager';
import { WebviewPanelController } from './core/webview';
import { PackageJsonReader } from './core/PackageJsonReader';

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

    // const webviewPanel = new WebviewPanel(context);
    console.log(1);

    console.log('vscode.window.registerWebviewPanelSerializer', vscode.window.registerWebviewPanelSerializer);

    const webviewController = new WebviewPanelController();

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('extension.helloWorld', async (file: vscode.Uri) => {
        // The code you place here will be executed every time your command is executed

        /*
            TODO: Add checks that the file is indeed packageJson
        */

        try {
            const json = await PackageJsonReader.read(file);
            const packageJsonDirectory = path.dirname(file.fsPath);

            const localDependenciesManager = new LocalDependenciesManager({
                packageJsonFile: json,
                packageJsonDirectory,
            });

            console.log(2);
            const webviewPanel = webviewController.create(context);

            const sylvatica = new Sylvatica(localDependenciesManager, webviewPanel);

            sylvatica.initialization();
        } catch(error) {
            console.error(error);
            vscode.window.showErrorMessage('Oops');
        }
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
