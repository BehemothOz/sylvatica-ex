import * as vscode from 'vscode';
import * as fs from 'fs';

/**
 * Interface representing a file manager.
 * @interface
 */
export interface IFileManager {
    /**
     * Checks if a file or directory exists at the given URI.
     */
    exist: (uri: vscode.Uri) => boolean;
    /**
     * Joins a root URI and a file name into a single URI.
     */
    joinPath: (root: vscode.Uri, fileName: string) => vscode.Uri;
}

export class FileManager implements IFileManager {
    /**
     * @returns {boolean} True if the file or directory exists, false otherwise.
     */
    exist(uri: vscode.Uri): boolean {
        return fs.existsSync(uri.fsPath);
    }

    /**
     * @returns {vscode.Uri} The joined URI.
     */
    joinPath(root: vscode.Uri, fileName: string): vscode.Uri {
        return vscode.Uri.joinPath(root, fileName);
    }

    /**
     * @returns {Promise<boolean>} A promise that resolves to true if the URI points to a directory, false otherwise.
     */
    async isDirectory(uri: vscode.Uri): Promise<boolean> {
        const stat = await vscode.workspace.fs.stat(uri);
        return stat.type === vscode.FileType.Directory;
    }
}

export const fm = new FileManager();
