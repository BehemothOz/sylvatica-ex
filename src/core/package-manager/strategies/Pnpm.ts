import { type PackageManagerStrategy } from '../types';

export class Pnpm implements PackageManagerStrategy {
    upgrade(latestVersion: string) {
        console.log('pnpm:upgrade: ', latestVersion);
    }
}