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
                        <main>
                            <span class="spin" id="spin">
                                <sy-spinner class="icon-spin"></sy-spinner>
                                The analysis process has been started. Please wait
                            </span>
                            <div id="root"></div>
                        </main>

                        <!--  -->
                        <template id="badge-template">
                            <style>
                                :host {
                                    display: inline-block;
                                    width: 8px;
                                    height: 8px;
                                    margin-right: 4px;
                                    background-color: rgb(219, 217, 213);
                                    border-radius: 50%;
                                }

                                :host([color='orange']) {
                                    background-color: #f1e05a;
                                }

                                :host([color='green']) {
                                    background-color: #26a641;
                                }

                                :host([color='red']) {
                                    background-color: #e34c26;
                                }

                                :host([color='blue']) {
                                    background-color: #26a641;
                                }
                            </style>
                        </template>

                        <!--  -->
                        <template id="icon-wrapper-template">
                            <style>
                                :host {
                                    display: inline-flex;
                                    align-items: center;
                                    font-style: normal;
                                    line-height: 0;
                                    color: inherit;
                                    text-align: center;
                                    text-transform: none;
                                    vertical-align: -0.125em;
                                    text-rendering: optimizeLegibility;
                                    pointer-events: none;
                                }
                            </style>
                            <slot></slot>
                        </template>

                        <!--  -->
                        <template id="spinner-template">
                            <style>
                                .loader {
                                    display: inline-block;
                                    width: 1.2rem;
                                    height: 1.2rem;
                                    border-radius: 50%;
                                    border: 4px solid;
                                    border-color: #e4e4ed;
                                    border-right-color: #766df4;
                                    animation: circle 1s infinite linear;
                                }

                                @keyframes circle {
                                    to {
                                        transform: rotate(1turn);
                                    }
                                }
                            </style>
                            <div class="loader"></div>
                        </template>

                        <!--  -->
                        <template id="icon-update-template">
                            <svg
                                viewBox="64 64 896 896"
                                focusable="false"
                                data-icon="redo"
                                width="1em"
                                height="1em"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    d="M758.2 839.1C851.8 765.9 912 651.9 912 523.9 912 303 733.5 124.3 512.6 124 291.4 123.7 112 302.8 112 523.9c0 125.2 57.5 236.9 147.6 310.2 3.5 2.8 8.6 2.2 11.4-1.3l39.4-50.5c2.7-3.4 2.1-8.3-1.2-11.1-8.1-6.6-15.9-13.7-23.4-21.2a318.64 318.64 0 01-68.6-101.7C200.4 609 192 567.1 192 523.9s8.4-85.1 25.1-124.5c16.1-38.1 39.2-72.3 68.6-101.7 29.4-29.4 63.6-52.5 101.7-68.6C426.9 212.4 468.8 204 512 204s85.1 8.4 124.5 25.1c38.1 16.1 72.3 39.2 101.7 68.6 29.4 29.4 52.5 63.6 68.6 101.7 16.7 39.4 25.1 81.3 25.1 124.5s-8.4 85.1-25.1 124.5a318.64 318.64 0 01-68.6 101.7c-9.3 9.3-19.1 18-29.3 26L668.2 724a8 8 0 00-14.1 3l-39.6 162.2c-1.2 5 2.6 9.9 7.7 9.9l167 .8c6.7 0 10.5-7.7 6.3-12.9l-37.3-47.9z"
                                ></path>
                            </svg>
                        </template>

                        <!--  -->
                        <template id="icon-basket-template">
                            <svg
                                viewBox="64 64 896 896"
                                focusable="false"
                                data-icon="delete"
                                width="1em"
                                height="1em"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"
                                ></path>
                            </svg>
                        </template>

                        <!--  -->
                        <template id="icon-close-circle-template">
                            <svg
                                viewBox="64 64 896 896"
                                focusable="false"
                                data-icon="close-circle"
                                width="1em"
                                height="1em"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    d="M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960 64 759.4 64 512 264.6 64 512 64zm127.98 274.82h-.04l-.08.06L512 466.75 384.14 338.88c-.04-.05-.06-.06-.08-.06a.12.12 0 00-.07 0c-.03 0-.05.01-.09.05l-45.02 45.02a.2.2 0 00-.05.09.12.12 0 000 .07v.02a.27.27 0 00.06.06L466.75 512 338.88 639.86c-.05.04-.06.06-.06.08a.12.12 0 000 .07c0 .03.01.05.05.09l45.02 45.02a.2.2 0 00.09.05.12.12 0 00.07 0c.02 0 .04-.01.08-.05L512 557.25l127.86 127.87c.04.04.06.05.08.05a.12.12 0 00.07 0c.03 0 .05-.01.09-.05l45.02-45.02a.2.2 0 00.05-.09.12.12 0 000-.07v-.02a.27.27 0 00-.05-.06L557.25 512l127.87-127.86c.04-.04.05-.06.05-.08a.12.12 0 000-.07c0-.03-.01-.05-.05-.09l-45.02-45.02a.2.2 0 00-.09-.05.12.12 0 00-.07 0z"
                                ></path>
                            </svg>
                        </template>
                        <script src="${this.scriptFileUri}"></script>
                    </body>
                </html>
            `;
    }
}
