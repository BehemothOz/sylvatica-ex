import { type PackageManagerStrategy } from '../types';

export class Npm implements PackageManagerStrategy {
    upgrade(latestVersion: string) {
        console.log('npm:upgrade: ', latestVersion);
    }
}
