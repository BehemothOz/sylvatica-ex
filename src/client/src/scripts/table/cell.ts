import { type Column } from '../types';

export function createCell(column: Column, rowData: PackageModel) {
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

    return cell;
}
