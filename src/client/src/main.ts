import './scripts/components';

import { columns } from './scripts/columns';
import { generateTable } from './scripts/table';
import { type Package } from './scripts/types';

/*
    https://uit.stanford.edu/accessibility/concepts/tables/css-aria
    https://adrianroselli.com/2017/11/a-responsive-accessible-table.html

    https://habr.com/ru/articles/546980/
    https://learn.javascript.ru/webcomponents-intro
*/

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

const root = document.getElementById('root') as HTMLDivElement;
const table = generateTable(columns, data);

root.append(table);
