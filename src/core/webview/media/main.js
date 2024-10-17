// eslint-disable-next-line no-undef
window.addEventListener('message', (event) => {
    const { type, payload } = event.data;

    switch (type) {
        case 'INITIALIZATION': {
            // eslint-disable-next-line no-undef
            const root = document.getElementById('root');
            root.textContent = 'Yup';
            break;
        }
        case 'DEPENDENCIES': {
            // eslint-disable-next-line no-undef
            const root = document.getElementById('root');
            // eslint-disable-next-line no-undef
            console.log(event.data.data);
            root.append(createTable(event.data.data));
            break;
        }
        case 'DEV_DEPENDENCIES': {
            // ...
            break;
        }
        case 'PACKAGE_MANAGER_DETECTED': {
            // eslint-disable-next-line no-undef
            const root = document.getElementById('root');
            // eslint-disable-next-line no-undef
            const span = document.createElement('span');

            span.textContent = 'detected';
            root.append(span);
        }
    }
});

const columns = [
    {
        title: 'Package',
        key: 'name',
    },
    {
        title: 'Current Version',
        key: 'version',
    },
    {
        title: 'Last Version',
        key: 'lastVersion',
    },
    {
        title: 'Description',
        key: 'description',
    },
];

function createTable(packages) {
    // eslint-disable-next-line no-undef
    const table = document.createElement('table');
    // eslint-disable-next-line no-undef
    const fragment = document.createDocumentFragment();

    for (const package of packages) {
        const row = createRow(package);
        fragment.append(row);
    }

    table.append(createTableHeader());
    table.append(fragment);

    return table;
}

function createTableHeader() {
    // eslint-disable-next-line no-undef
    const header = document.createElement('tr');

    for (const column of columns) {
        // eslint-disable-next-line no-undef
        const cell = document.createElement('th');
        cell.textContent = column.title;

        header.append(cell);
    }

    return header;
}

function createRow(package) {
    // eslint-disable-next-line no-undef
    const row = document.createElement('tr');

    for (const column of columns) {
        // eslint-disable-next-line no-undef
        const cell = document.createElement('td');
        cell.textContent = package[column.key];

        row.append(cell);
    }

    return row;
}
