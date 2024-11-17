import './scripts/components';

import { createColumns } from './scripts/columns';
import { generateTable } from './scripts/table';

/*
    https://uit.stanford.edu/accessibility/concepts/tables/css-aria
    https://adrianroselli.com/2017/11/a-responsive-accessible-table.html

    https://habr.com/ru/articles/546980/
    https://learn.javascript.ru/webcomponents-intro
*/

/*
    # Mock for test
    const data: Array<Package> = [
        {
            name: 'axios',
            diff: 'major',
            range: '^1.2.0',
            version: '1.2.4',
            lastVersion: '3.0.1',
            homepage: 'https://www.google.com',
        },
    ];

    const columns = createColumns({ isVisibleButtons: false });
    root.append(generateTable(columns, data));
*/

const root = document.getElementById('root') as HTMLDivElement;

window.addEventListener('message', (event) => {
    const { type, payload } = event.data;

    switch (type) {
        case 'INITIALIZATION': {
            console.log('INITIALIZATION');
            break;
        }
        case 'DEPENDENCIES': {
            const columns = createColumns({ isVisibleButtons: false });
            root.append(generateTable(columns, event.data.data));
            break;
        }
        case 'DEV_DEPENDENCIES': {
            // ...
            break;
        }
        case 'PACKAGE_MANAGER_DETECTED': {
            console.log('PACKAGE_MANAGER_DETECTED');
            break;
        }
    }
});
