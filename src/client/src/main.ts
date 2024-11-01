import './scripts/components';

import { columns } from './scripts/columns';
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
*/

const data: any = [
    {
        name: 'axios',
        diff: 'major',
        range: '^1.2.0',
        version: '1.2.4',
        lastVersion: '3.0.1',
        homepage: 'https://www.google.com',
    },
    {
        name: 'react',
        diff: 'minor',
        range: '^18.2.0',
        version: '18.2.4',
        lastVersion: '18.6.0',
        homepage: 'https://www.react.com',
    },
    {
        name: 'classnames',
        diff: 'patch',
        range: '^2.2.0',
        version: '2.2.4',
        lastVersion: '2.2.6',
        homepage: 'https://www.npm.com',
    },
];

const root = document.getElementById('root') as HTMLDivElement;

root.append(generateTable(columns, data));
root.append(generateTable(columns, data));
root.append(generateTable(columns, data));

window.addEventListener('message', (event) => {
    const { type, payload } = event.data;

    switch (type) {
        case 'INITIALIZATION': {
            console.log('INITIALIZATION');
            break;
        }
        case 'DEPENDENCIES': {
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
