import mock from 'mock-fs';
import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';
import { Registry } from './Registry';

import { fm } from '../FileManager';

function createRcFileContent() {
    const rows = ['registry=https://custom.npmjs.org/', '@custom:registry=https://custom.npmjs.org/'];

    return rows.join('\n');
}

// https://devblogs.microsoft.com/ise/testing-vscode-extensions-with-typescript/

describe('Registry', () => {
    beforeEach(() => {
        mock({
            configuration: {
                '.npmrc': '',
            },
        });

        const absPathToRcFile = path.join(process.cwd(), 'configuration', '.npmrc');

        vscode.Uri.joinPath = jest.fn().mockReturnValue(vscode.Uri.file(absPathToRcFile));
        fm.readFile = jest.fn().mockReturnValue(createRcFileContent());
    });

    afterEach(() => {
        mock.restore();
        jest.clearAllMocks();
    });

    it('simple test', async () => {
        // const registry = await Registry.build(vscode.Uri.file(''));

        expect(1 + 1).toBe(2);
    });
});
