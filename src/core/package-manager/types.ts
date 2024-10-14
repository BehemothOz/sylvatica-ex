export type PackageManagerName = 'yarn' | 'npm' | 'pnpm';

export interface PackageManagerStrategy {
    upgrade: (latestVersion: string) => void;
}
