export function createAlert(message: string) {
    const root = document.createElement('div');
    const span = document.createElement('span');
    const text = document.createTextNode(message);

    const closeIconTemplate = document.getElementById('icon-close-circle-template') as HTMLTemplateElement;
    const closeIcon = closeIconTemplate.content.cloneNode(true);

    root.classList.add('alert-message');
    span.classList.add('icon');

    span.append(closeIcon);
    root.append(span, text);

    return root;
}
