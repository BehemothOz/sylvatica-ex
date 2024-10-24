import { columns } from './columns';

function generateHeader() {
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

function generateTable() {}
