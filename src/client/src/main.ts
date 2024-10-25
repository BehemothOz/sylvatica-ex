/*
    https://uit.stanford.edu/accessibility/concepts/tables/css-aria
    https://adrianroselli.com/2017/11/a-responsive-accessible-table.html

    https://habr.com/ru/articles/546980/
    https://learn.javascript.ru/webcomponents-intro
*/

// const data: Array<Package> = [ --> package-info
//     {
//         name: 'Axios',
//         version: '1.2.4',
//         lastVersion: '3.0.1',
//         description: 'Lorem ipsum dolor sit met, consectetur edit.',
//         homepage: 'https://www.google.com',
//     },
// ];

const dependenciesTable = document.getElementById('dependencies');

const table = document.getElementById('table') as HTMLTableElement;

table.addEventListener('click', (event) => {
    console.log(event.target);
});
