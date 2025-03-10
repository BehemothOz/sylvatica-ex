import './scripts/components';

import { createColumns } from './scripts/columns';
import { createAlert } from './scripts/alert';
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

function toggleSpinElement() {
    const spin = document.getElementById('spin') as HTMLDivElement;

    return {
        show: () => spin.classList.remove('hide'),
        hide: () => spin.classList.add('hide'),
    };
}

const root = document.getElementById('root') as HTMLDivElement;
const spin = toggleSpinElement();

window.addEventListener('message', (event) => {
    const { type, payload } = event.data;

    switch (type) {
        case 'INITIALIZATION': {
            console.log('INITIALIZATION');

            root.innerHTML = '';
            spin.show();
            break;
        }
        case 'DEPENDENCIES': {
            const { title, packages } = payload;

            const columns = createColumns({ isVisibleButtons: false });

            spin.hide();
            root.append(generateTable({ title, columns, dataTable: packages }));
            break;
        }
        case 'DEV_DEPENDENCIES': {
            const { title, packages } = payload;

            const columns = createColumns({ isVisibleButtons: false });

            spin.hide();
            root.append(generateTable({ title, columns, dataTable: packages }));
            break;
        }
        case 'ERROR_DETECTED': {
            const errorMessage = createAlert(payload);
            root.append(errorMessage);
            break;
        }
        case 'PACKAGE_MANAGER_DETECTED': {
            console.log('PACKAGE_MANAGER_DETECTED');
            break;
        }
    }
});
