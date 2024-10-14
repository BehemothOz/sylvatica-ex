import { Npm, Pnpm, Yarn } from './strategies';
import { type PackageManagerName, type PackageManagerStrategy } from './types';

const StrategiesByName = { npm: Npm, pnpm: Pnpm, yarn: Yarn };

export class PackageManagerContext {
    strategies: Map<PackageManagerName, PackageManagerStrategy> = new Map();

    use(strategyName: PackageManagerName) {
        const isExistStrategy = this.strategies.has(strategyName);

        if (isExistStrategy == false) {
            this.strategies.set(strategyName, new StrategiesByName[strategyName]());
        }

        return this.strategies.get(strategyName)!;
    }
}
