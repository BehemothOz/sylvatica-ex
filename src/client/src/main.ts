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

/*
    package-info
*/

class Spinner extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        const template = document.getElementById('spinner-template') as HTMLTemplateElement;

        shadow.append(template.content.cloneNode(true));
    }
}

customElements.define('sy-spinner', Spinner);
