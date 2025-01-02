import { createHeader } from './header';
import { createRows } from './row';
import { type Column, type PackageType } from '../types';

function createTableWrapper() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('table-wrapper');

    return wrapper;
}

function createTableTitle() {
    const title = document.createElement('h2');
    title.textContent = 'Dependencies';

    return title;
}

function createTableContainer() {
    const container = document.createElement('section');
    const title = createTableTitle();

    container.classList.add('table-section');
    container.append(title);

    return container;
}

export function generateTable(columns: Array<Column>, payload: Array<PackageType>) {
    const container = createTableContainer();
    const wrapper = createTableWrapper();

    const table = document.createElement('table');

    const header = createHeader(columns);
    const rows = createRows(columns, payload);

    table.append(header, rows);
    wrapper.append(table);
    container.append(wrapper);

    return container;
}
