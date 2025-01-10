import { createCell } from './cell';
import { type Column, type DamageColumn, type PackageType } from '../types';

function createRow(columns: Array<Column>, rowData: PackageModel) {
    const row = document.createElement('tr');

    for (const column of columns) {
        row.append(createCell(column, rowData));
    }

    return row;
}

function createErrorRow(columns: Array<DamageColumn>, rowData: DamagePackageModel) {
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    const damageCell = document.createElement('td');

    [nameCell, damageCell].forEach((cell) => cell.classList.add('damage'));

    nameCell.setAttribute('data-label', columns[0].title);
    damageCell.setAttribute('colspan', `${columns.length - 1}`);

    nameCell.textContent = rowData.name;
    damageCell.textContent = rowData.error;

    row.append(nameCell, damageCell);

    return row;
}

export function createRows(columns: Array<Column | DamageColumn>, payload: Array<PackageType>) {
    const body = document.createElement('tbody');

    for (const rowData of payload) {
        const isDamagePayload = 'damage' in rowData;

        if (isDamagePayload) {
            const damageColumns = columns as Array<DamageColumn>;
            const errorRow = createErrorRow(damageColumns, rowData);
            body.append(errorRow);
        } else {
            const row = createRow(columns as Array<Column>, rowData);
            body.append(row);
        }
    }

    return body;
}
