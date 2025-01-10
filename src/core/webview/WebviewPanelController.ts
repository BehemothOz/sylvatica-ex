import * as vscode from 'vscode';
import { WebviewPanel, DEFAULT_VIEW_COLUMN } from './WebviewPanel';

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
