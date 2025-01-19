export class MockUri {
    constructor(public fsPath: string) {}
}

export const Uri = {
    file: jest.fn((filePath: string) => {
        return new MockUri(filePath);
    }),
    joinPath: jest.fn(),
};

export const workspace = {
    fs: {
        readFile: jest.fn(),
    },
};

const vscode = {
    Uri,
    workspace,
};

module.exports = vscode;
