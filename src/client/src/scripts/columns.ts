import { Column } from './types';
import { createButtons } from './buttons';

const buttons = createButtons();

export const columns: Array<Column> = [
    /**
     * Package name (dependency name from package.json)
     */
    {
        title: 'Package',
        key: 'name',
        render: (rowData) => {
            const fragment = document.createDocumentFragment();

            const badge = document.createElement('sy-badge');
            const span = document.createElement('span');

            badge.setAttribute('color', 'green');
            span.textContent = rowData.name;

            fragment.append(badge, span);

            return fragment;
        },
    },
    {
        title: 'Semver diff',
        key: 'diff',
    },
    /**
     * Versions range allowed for installation (from package.json)
     */
    {
        title: 'Range',
        key: 'range',
    },
    {
        title: 'Current Version',
        key: 'version',
    },
    {
        title: 'Last Version',
        key: 'lastVersion',
    },
    /**
     * Link to the package's home page
     */
    {
        title: 'Homepage',
        key: 'homepage',
    },
    {
        title: '',
        key: 'actions',
        render: (rowData) => {
            const wrapper = document.createElement('div');
            wrapper.append(buttons.update(), buttons.remove());

            return wrapper;
        },
    },
];
