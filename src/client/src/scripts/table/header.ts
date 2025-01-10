import { type Column, type DamageColumn } from '../types';

export function createHeader(columns: Array<Column | DamageColumn>) {
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
