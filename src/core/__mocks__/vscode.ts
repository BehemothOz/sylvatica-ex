export class MockUri {
    constructor(public fsPath: string) {}
}

export const Uri = {
    file: jest.fn((filePath: string) => {
        return new MockUri(filePath);
    }),
};

module.exports = { Uri };
