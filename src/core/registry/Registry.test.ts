import mock from 'mock-fs';
import * as fs from 'fs';
import { Registry } from './Registry';

function createRcFileContent() {
    const rows = [
        'registry=https://registry.npmjs.org/authToken=your-auth-token',
        'registry=https://registry.npmjs.org/authToken=your-auth-token',
        'registry=https://registry.npmjs.org/authToken=your-auth-token',
    ];

    return rows.join('\n');
}

// https://devblogs.microsoft.com/ise/testing-vscode-extensions-with-typescript/

describe('Storage', () => {
    beforeEach(() => {
        mock({
            '.npmrc': createRcFileContent(),
        });

        console.log(mock);
    });

    afterEach(() => mock.restore());

    it('test_1', () => {
        const reg = Registry.build('/');
        const a = fs.readFileSync('.npmrc', { encoding: 'utf8', flag: 'r' });
        console.log(a);
        console.log(reg);
        // const a = vscode.Uri.file('/');
        // console.log(a);
        expect(1 + 1).toBe(2);
    });
});
