/*
    https://uit.stanford.edu/accessibility/concepts/tables/css-aria
    https://adrianroselli.com/2017/11/a-responsive-accessible-table.html

    https://habr.com/ru/articles/546980/
    https://learn.javascript.ru/webcomponents-intro
*/

interface Package {
    name: string;
    version: string;
    lastVersion: string;
    description: string;
    homepage: string;
}

class Cell extends HTMLTableCellElement {
    constructor() {
        super();
    }
}

customElements.define('cell', Cell);

/*
    package-info
*/
