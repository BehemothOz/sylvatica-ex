import { type Column, type PackageType } from '../types';

function createRow(columns: Array<Column>, rowData: PackageModel) {
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
        } else if (column.key) {
            const value = rowData[column.key];
            cell.textContent = value;
        } else {
            cell.textContent = '';
        }

        row.append(cell);
    }

    return row;
}

function createErrorRow(columns: Array<Column>, rowData: DamagePackageModel) {
    const row = document.createElement('tr');
    return row;
}

export function createRows(columns: Array<Column>, payload: Array<PackageType>) {
    const body = document.createElement('tbody');

    for (const rowData of payload) {
        const isDamagePayload = 'damage' in rowData;

        if (isDamagePayload) {
            const rowWithError = createErrorRow(columns, rowData);
            body.append(rowWithError);
        } else {
            const row = createRow(columns, rowData);
            body.append(row);
        }
    }

    return body;
}
