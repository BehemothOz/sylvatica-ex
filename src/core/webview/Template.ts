import * as vscode from 'vscode';

import { fm } from '../FileManager';

interface TemplateParams {
    webview: vscode.Webview;
    extensionUri: vscode.Uri;
    title: string;
}

export class Template {
    private title: string;
    private extensionUri: vscode.Uri;
    webview: vscode.Webview;

    private styleFileUri: vscode.Uri;
    private scriptFileUri: vscode.Uri;

    constructor(params: TemplateParams) {
        this.title = params.title;
        this.extensionUri = params.extensionUri;
        this.webview = params.webview;

        /*
            TODO: Find another place for media folder (webview)
        */
        this.styleFileUri = this.getWebviewUri('src', 'core', 'webview', 'media', 'main.css');
        this.scriptFileUri = this.getWebviewUri('src', 'core', 'webview', 'media', 'main.js');
    }

    private getWebviewUri(...pathSegments: string[]) {
        const assetFilePath = fm.joinPath(this.extensionUri, ...pathSegments);
        const assetFileUri = this.webview.asWebviewUri(assetFilePath);

        return assetFileUri;
    }

    /*
        const vscode = acquireVsCodeApi();
        const previousState = vscode.getState();
        vscode.setState({ count });
    */
    getContent() {
        return `
            <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>${this.title}</title>
                        <link href="${this.styleFileUri}" rel="stylesheet">
                    </head>
                    <body>
                        <h1>Hello</h1>
                        <div id="root"></div>
                        <script src="${this.scriptFileUri}"></script>
                    </body>
                </html>
            `;
    }
}
