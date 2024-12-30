type ButtonType = 'primary' | 'danger';

function createButton(type: ButtonType, icon: Node) {
    const button = document.createElement('button');
    const iconWrapper = document.createElement('sy-icon');

    button.classList.add('button-icon', type);

    iconWrapper.append(icon);
    button.append(iconWrapper);

    return button;
}

export function createButtons() {
    const updateIconTemplate = document.getElementById('icon-update-template') as HTMLTemplateElement;
    const basketIconTemplate = document.getElementById('icon-basket-template') as HTMLTemplateElement;

    return {
        update: () => {
            const icon = updateIconTemplate.content.cloneNode(true);
            return createButton('primary', icon);
        },
        remove: () => {
            const icon = basketIconTemplate.content.cloneNode(true);
            return createButton('danger', icon);
        },
    };
}
