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
    const caption = document.createElement('caption');
    caption.textContent = title;

    return caption;
}

function createRow(columns: Array<Column>, rowData: Package) {
    const row = document.createElement('tr');

    for (const column of columns) {
        const cell = document.createElement('td');

        if (column.className) {
            cell.classList.add(column.className);
        }

        if (column.render) {
            const cellValue = column.render(rowData);
            cell.append(cellValue);
        } else {
            const value = rowData[column.key];
            cell.textContent = value;
        }

        row.append(cell);
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

    table.append(caption, header, rows);

    return table;
}
