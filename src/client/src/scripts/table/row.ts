import { createCell } from './cell';
import { type Column, type DamageColumn, type BaseColumn, type PackageType } from '../types';

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

    damageCell.setAttribute('colspan', `${columns.length - 1}`);

    nameCell.textContent = rowData.name;
    damageCell.textContent = rowData.error.message;

    row.append(nameCell, damageCell);

    return row;
}

export function createRows(columns: Array<BaseColumn>, payload: Array<PackageType>) {
    const body = document.createElement('tbody');

    for (const rowData of payload) {
        const isDamagePayload = 'damage' in rowData;

        if (isDamagePayload) {
            const errorRow = createErrorRow(columns, rowData);
            body.append(errorRow);
        } else {
            const row = createRow(columns, rowData);
            body.append(row);
        }
    }

    return body;
}
