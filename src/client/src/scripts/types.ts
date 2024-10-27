export interface Package {
    name: string;
    diff: string;
    range: string;
    version: string;
    lastVersion: string;
    homepage: string;
}

export interface Column {
    title: string;
    key: keyof Package;
    render?: (rowData: Package) => HTMLElement | DocumentFragment | string;
}
