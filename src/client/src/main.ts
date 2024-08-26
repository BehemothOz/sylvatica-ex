import { a } from './main_a';

const node = document.getElementById('root')!;
node.textContent = `${a} count - 2`;

window.addEventListener('message', event => {
    const { payload } = event.data; // The json data that the extension sent
    console.log(payload);

    const parent = document.createElement('div');

    payload.forEach(payloadItem => {
        const child = document.createElement('div');
        child.textContent = payloadItem.title;

        parent.append(child);
    });

    node.append(parent);
});
