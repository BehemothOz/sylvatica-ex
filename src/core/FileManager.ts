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

    /*
        TODO: add async exist version
        const exists = (path: string) => fs.stat(path).then(() => true, () => false);
        OR use fs.access(path)
    */

    /**
     * @returns {vscode.Uri} The joined URI.
     */
    joinPath(root: vscode.Uri, ...pathSegments: string[]): vscode.Uri {
        return vscode.Uri.joinPath(root, ...pathSegments);
    }

    /**
     * Reads the contents of a file asynchronously and returns the decoded content as a string.
     *
     * @async
     * @param {vscode.Uri} filePath - The URI of the file to read.
     * @returns {Promise<string>} - The decoded contents of the file.
     * @throws {Error} - If an error occurs while reading the file or decoding the contents.
     */
    async readFile(filePath: vscode.Uri): Promise<string> {
        /*
            Node: fs.readFile(packageJsonPath, 'utf-8')
        */
        const textDecoder = new TextDecoder('utf-8');

        const uint8ArrayData = await vscode.workspace.fs.readFile(filePath);
        const fileContent = textDecoder.decode(uint8ArrayData);

        return fileContent;

        // TODO: throw new Error(`Error reading file: ${filePath}\n${error}`);
    }
}

export const fm = new FileManager();
