import mock from 'mock-fs';

function createRcFileContent() {
    const rows = [
        'registry=https://registry.npmjs.org/authToken=your-auth-token',
        'registry=https://registry.npmjs.org/authToken=your-auth-token',
        'registry=https://registry.npmjs.org/authToken=your-auth-token',
    ];

    return rows.join('\n');
}

describe('Storage', () => {
    beforeEach(() => {
        mock({
            'fake-file': createRcFileContent(),
        });
    });

    afterEach(() => mock.restore());
});
