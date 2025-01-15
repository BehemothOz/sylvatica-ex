import mock from 'mock-fs';

describe('Storage', () => {
    beforeEach(() => {
        mock({
            'fake-file': 'file contents',
        });
    });

    afterEach(() => mock.restore());
});
