export interface BaseColumn<T = unknown> {
    title: string;
    key: keyof T | null;
    className?: string;
    render?: (rowData: T) => HTMLElement | DocumentFragment | string;
}

export type Column = BaseColumn<PackageModel>;
export type DamageColumn = BaseColumn<DamagePackageModel>;

export type PackageType = PackageModel | DamagePackageModel;
