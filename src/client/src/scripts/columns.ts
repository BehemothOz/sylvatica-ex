import { Column } from './types';

export const columns: Array<Column> = [
    /**
     * Package name (dependency name from package.json)
     */
    {
        title: 'Package',
        key: 'name',
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
];
