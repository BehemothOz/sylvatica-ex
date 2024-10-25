import { Column, Package } from './types';

function createHeader(columns: Array<Column>) {
    const header = document.createElement('tr');

    for (const column of columns) {
        const headerCell = document.createElement('th');
        headerCell.textContent = column.title;

        header.append(headerCell);
    }

    return header;
}

function createCaption(title: string) {
    const caption = document.createElement('tr');
    caption.textContent = title;

    return caption;
}

function createRow(columns: Array<Column>, rowData: Package) {
    const row = document.createElement('tr');

    for (const column of columns) {
        const cell = document.createElement('td');
        const value = rowData[column.key];

        cell.textContent = value;
    }

    return row;
}

function createRows(columns: Array<Column>, payload: Array<Package>) {
    const fragment = document.createDocumentFragment();

    for (const rowData of payload) {
        const row = createRow(columns, rowData);
        fragment.append(row);
    }

    return fragment;
}

export function generateTable(columns: Array<Column>, payload: Array<Package>) {
    const table = document.createElement('table');

    const caption = createCaption('Caption');
    const header = createHeader(columns);

    const rows = createRows(columns, payload);

    table.append(caption);
    table.append(header);
    table.append(rows);
}
