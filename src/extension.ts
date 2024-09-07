// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

import { fm } from './core/FileManager';

import { PackageManagerDetector } from './core/detecter';
import { PackageJsonReader } from './core/PackageJsonReader';

import { PackageBuilder } from './core/Package';
import { comparison } from './core/comparison';

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

    const packageManagerDetector = new PackageManagerDetector();

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('extension.helloWorld', async (file: vscode.Uri) => {
        // The code you place here will be executed every time your command is executed
        const sylvatica = new Sylvatica();
        const directoryPath = path.dirname(file.fsPath);

        const json = await PackageJsonReader.read(file);

        comparison();

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
