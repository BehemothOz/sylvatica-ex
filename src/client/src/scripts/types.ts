export type ReleaseType =
    | 'major'
    | 'premajor'
    | 'minor'
    | 'preminor'
    | 'patch'
    | 'prepatch'
    | 'prerelease'
    | 'build'
    | null;

export interface Package {
    name: string;
    diff: ReleaseType;
    range: string;
    version: string;
    latestVersion: string;
    homepage: string;
}

export interface Column {
    title: string;
    key: keyof Package | 'actions';
    className?: string;
    render?: (rowData: Package) => HTMLElement | DocumentFragment | string;
}
