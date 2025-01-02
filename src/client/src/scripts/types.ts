export interface Column {
    title: string;
    key: keyof PackageModel | null;
    className?: string;
    render?: (rowData: PackageModel) => HTMLElement | DocumentFragment | string;
}

export type PackageType = PackageModel | DamagePackageModel;
