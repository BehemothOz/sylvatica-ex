import { Column, Package } from './types';

function createTableWrapper() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('table-wrapper');

    return wrapper;
}

function createHeader(columns: Array<Column>) {
    const header = document.createElement('thead');
    const headerRow = document.createElement('tr');

    for (const column of columns) {
        const headerCell = document.createElement('th');
        headerCell.textContent = column.title;

        headerRow.append(headerCell);
    }

    header.append(headerRow);
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

        cell.setAttribute('data-label', column.title);

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
    const wrapper = createTableWrapper();
    const table = document.createElement('table');

    const caption = createCaption('Caption');
    const header = createHeader(columns);
    const rows = createRows(columns, payload);

    table.append(header, rows);
    wrapper.append(table);

    return wrapper;
}
