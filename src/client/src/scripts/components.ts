class Spinner extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        const template = document.getElementById('spinner-template') as HTMLTemplateElement;

        shadow.append(template.content.cloneNode(true));
    }
}

class Icon extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        const template = document.getElementById('icon-wrapper-template') as HTMLTemplateElement;

        shadow.append(template.content.cloneNode(true));
    }
}

class Badge extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        const template = document.getElementById('badge-template') as HTMLTemplateElement;

        shadow.append(template.content.cloneNode(true));
    }
}

customElements.define('sy-spinner', Spinner);
customElements.define('sy-icon', Icon);
customElements.define('sy-badge', Badge);
