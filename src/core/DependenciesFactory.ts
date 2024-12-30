import { EventEmitter } from 'events';

import { TaskExecutionError, TaskManager } from './task-manager';
import { Package, DamagePackage, CandidatePackage, type DamageType } from './package';
import { type PackumentCache, type PackumentWrappedValue, type PackumentWrappedErrorValue } from './packument-service';

import { MissingPackageJsonError, type LocalDependencyResult } from './LocalDependenciesManager';
import { PackageJsonParseError } from './PackageJsonReader';

export class DependenciesFactory {
    private taskManager: TaskManager<PackumentWrappedValue, PackumentWrappedErrorValue>;
    private emitter: EventEmitter;

    private cache: PackumentCache;
    private packages: Map<string, CandidatePackage | Package | DamagePackage> = new Map();

    constructor(cache: PackumentCache) {
        this.cache = cache;

        this.taskManager = new TaskManager();
        this.emitter = new EventEmitter();
    }

    async analyze(localDependencies: AsyncIterable<LocalDependencyResult>) {
        try {
            await this.getDependenciesInfo(localDependencies);
            await this.getLatestVersions();

            console.log('main log', Array.from(this.packages.values()));
            // this.emitter.emit('analyze-finished', Array.from(this.packages.values()));
        } catch (error) {
            console.log('Error');
        }
    }

    on(cb: (packages: Package[]) => void) {
        this.emitter.on('analyze-finished', cb);
    }

    private async getDependenciesInfo(localDependencies: AsyncIterable<LocalDependencyResult>) {
        for await (const dependencyInfo of localDependencies) {
            const { status, payload } = dependencyInfo;
            const { key: packageName } = payload;

            const candidatePackage = new CandidatePackage(packageName);

            if (status === 'rejected') {
                let damage: DamageType = 'unknown';

                if (payload.reason instanceof MissingPackageJsonError) {
                    damage = 'uninstall';
                }

                if (payload.reason instanceof PackageJsonParseError) {
                    damage = 'unparsable';
                }

                const damagePackage = candidatePackage.toDamage({ damage, error: payload.reason });
                this.packages.set(packageName, damagePackage);
            } else {
                const { range, packageJson } = payload.value;

                candidatePackage.setLocalPackageInfo({ range, version: packageJson.version });
                this.packages.set(packageName, candidatePackage);

                this.taskManager.addTask(() => {
                    return this.cache.wrap(packageName);
                });
            }
        }
    }

    private async getLatestVersions() {
        for await (const packumentInfo of this.taskManager.run()) {
            console.log(1);
            const { status, payload } = packumentInfo;
            const { key: packageName } = payload;

            const candidatePackage = this.packages.get(packageName);

            console.log(candidatePackage, packageName, status);

            if (candidatePackage instanceof CandidatePackage) {
                if (status === 'rejected') {
                    const damagePackage = candidatePackage.toDamage({
                        damage: 'registry-fail',
                        error: payload.reason,
                    });
                    this.packages.set(packageName, damagePackage);
                    continue;
                }

                const finalPackage = candidatePackage.setPackument(payload.value).toPackage();
                this.packages.set(packageName, finalPackage);
            }
        }
    }
}
