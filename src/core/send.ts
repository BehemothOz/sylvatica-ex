export const sendRequest = async (id: number) => {
    // https://registry.npmjs.org/date-fns/latest
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    return await response.json();
};
