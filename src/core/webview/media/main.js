// eslint-disable-next-line no-undef
window.addEventListener('message', event => {
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
            console.log(event.data.data);
            // eslint-disable-next-line no-undef
            const root = document.getElementById('root');
            root.textContent = JSON.stringify(event.data.data, null, 2);
            break;
        }
    }
});
