import { createHeader } from './header';
import { createRows } from './row';
import { Column, DamageColumn, type BaseColumn, type PackageType } from '../types';

function createTableWrapper() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('table-wrapper');

    return wrapper;
}

function createTableTitle(text: string) {
    const title = document.createElement('h2');
    title.textContent = text;

    return title;
}

function createTableContainer(text: string) {
    const container = document.createElement('section');
    const title = createTableTitle(text);

    container.classList.add('table-section');
    container.append(title);

    return container;
}

interface CreationTableProps {
    title: string;
    columns: Array<Column | DamageColumn>;
    dataTable: Array<PackageType>;
}

export function generateTable({ title, columns, dataTable }: CreationTableProps) {
    const container = createTableContainer(title);
    const wrapper = createTableWrapper();

    const table = document.createElement('table');

    const header = createHeader(columns);
    const rows = createRows(columns, dataTable);

    table.append(header, rows);
    wrapper.append(table);
    container.append(wrapper);

    return container;
}
