// eslint-disable-next-line no-undef
window.addEventListener('message', event => {
    const { type } = event.data;

    switch (type) {
        case 'INITIALIZATION': {
            // eslint-disable-next-line no-undef
            const root = document.getElementById('root');
            root.textContent = 'Yup';
            break;
        }
    }
});
