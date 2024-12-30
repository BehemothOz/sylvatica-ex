import { type PackageManagerStrategy } from '../types';

export class Yarn implements PackageManagerStrategy {
    upgrade(latestVersion: string) {
        console.log('yarn:upgrade: ', latestVersion);
    }
}
