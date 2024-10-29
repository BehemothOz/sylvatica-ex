import { Column, ReleaseType } from './types';
import { createButtons } from './buttons';

const buttons = createButtons();

/*
    TODO: move
*/
function selectBadgeColor(diff: ReleaseType) {
    if (diff == null) return 'gray';
    if (diff.startsWith('pre')) return 'blue';

    switch (diff) {
        case 'major':
            return 'red';
        case 'minor':
            return 'orange';
        case 'patch':
            return 'green';
        default:
            return 'gray';
    }
}

export const columns: Array<Column> = [
    /**
     * Package name (dependency name from package.json)
     */
    {
        title: 'Package',
        key: 'name',
        render: (rowData) => {
            const container = document.createElement('div');
            container.classList.add('package-name');

            const badge = document.createElement('sy-badge');
            const span = document.createElement('span');

            badge.setAttribute('color', selectBadgeColor(rowData.diff));
            span.textContent = rowData.name;

            container.append(badge, span);

            return container;
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
        className: 'range',
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
