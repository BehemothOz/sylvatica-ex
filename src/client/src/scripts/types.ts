export interface Column {
    title: string;
    key: keyof PackageModel | 'actions';
    className?: string;
    render?: (rowData: PackageType) => HTMLElement | DocumentFragment | string;
}

export type PackageType = PackageModel;
