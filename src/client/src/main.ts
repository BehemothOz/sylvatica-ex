import './scripts/components';

import { createColumns } from './scripts/columns';
import { generateTable } from './scripts/table';
import { createAlert } from './scripts/alert';

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
const data: Array<PackageModel | DamagePackageModel> = [
    {
        name: 'axios',
        diff: 'major',
        range: '^1.2.0',
        version: '1.2.4',
        latestVersion: '3.0.1',
        homepage: 'https://www.google.com',
    },
    {
        name: 'axios',
        diff: 'major',
        range: '^1.2.0',
        version: '1.2.4',
        latestVersion: '3.0.1',
        homepage: 'https://www.google.com',
    },
    {
        name: 'axios',
        damage: 'unknown',
        error: new Error(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent porttitor cursus ligula vitae tincidunt.'
        ),
    },
    {
        name: 'axios',
        damage: 'unknown',
        error: new Error(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent porttitor cursus ligula vitae tincidunt.'
        ),
    },
    {
        name: 'axios',
        damage: 'unknown',
        error: new Error(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent porttitor cursus ligula vitae tincidunt.'
        ),
    },
    {
        name: 'axios',
        damage: 'unknown',
        error: new Error(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent porttitor cursus ligula vitae tincidunt.'
        ),
    },
    {
        name: 'axios',
        diff: 'major',
        range: '^1.2.0',
        version: '3.0.0',
        latestVersion: '3.0.1',
        homepage: 'https://www.google.com',
    },
];

const columns = createColumns({ isVisibleButtons: false });

const root = document.getElementById('root') as HTMLDivElement;
root.append(
    createAlert(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent porttitor cursus ligula vitae tincidunt.'
    ),
    generateTable(columns, data)
);

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
            console.log(event);
            const columns = createColumns({ isVisibleButtons: false });
            root.append(generateTable(columns, event.data.data));
            break;
        }
        case 'PACKAGE_MANAGER_DETECTED': {
            console.log('PACKAGE_MANAGER_DETECTED');
            break;
        }
    }
});
