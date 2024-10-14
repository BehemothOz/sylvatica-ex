import { type PackageManagerName, type PackageManagerStrategy } from './types';

export class PackageManagerContext {
    strategies: Map<PackageManagerName, PackageManagerStrategy> = new Map();

    constructor(strategies: Record<PackageManagerName, PackageManagerStrategy>) {
        const strategyNames = Object.keys(strategies) as Array<PackageManagerName>;

        strategyNames.forEach((strategyName) => {
            this.strategies.set(strategyName, strategies[strategyName]);
        });
    }

    use(strategyName: PackageManagerName) {
        const strategy = this.strategies.get(strategyName);

        if (strategy) return strategy;
        throw new Error('add a strategy before using it');
    }
}
