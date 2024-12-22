import { EventEmitter } from 'events';

import { TaskExecutionError, TaskManager } from './task-manager';
import { Package, DamagePackage, type PackumentInfo } from './package';
import { type PackumentCache } from './packument-service';

import { MissingPackageJsonError, type LocalDependencyResult } from './LocalDependenciesManager';
import { PackageJsonParseError } from './PackageJsonReader';

export class DependenciesFactory {
    private taskManager: TaskManager<PackumentInfo>;
    private emitter: EventEmitter;

    private cache: PackumentCache;
    private packages: Map<string, Package | DamagePackage> = new Map();

    constructor(cache: PackumentCache) {
        this.cache = cache;

        this.taskManager = new TaskManager();
        this.emitter = new EventEmitter();
    }

    async analyze(localDependencies: AsyncIterable<LocalDependencyResult>) {
        try {
            await this.getDependenciesInfo(localDependencies);
            await this.getLatestVersions();

            this.emitter.emit('analyze-finished', Array.from(this.packages.values()));
        } catch (error) {
            console.log('Error');
        }
    }

    on(cb: (packages: Package[]) => void) {
        this.emitter.on('analyze-finished', cb);
    }

    private async getDependenciesInfo(localDependencies: AsyncIterable<LocalDependencyResult>) {
        for await (const dependencyInfo of localDependencies) {
            if (dependencyInfo instanceof MissingPackageJsonError) {
                const damagePackage = new DamagePackage({
                    name: dependencyInfo.name,
                    damage: 'uninstall',
                    error: dependencyInfo,
                });

                this.packages.set(dependencyInfo.name, damagePackage);
                continue;
            }

            if (dependencyInfo instanceof PackageJsonParseError) {
                const damagePackage = new DamagePackage({
                    name: dependencyInfo.name,
                    damage: 'unparsable',
                    error: dependencyInfo,
                });

                this.packages.set(dependencyInfo.name, damagePackage);
                continue;
            }

            const { name, range, packageJson } = dependencyInfo;

            const localPackage = new Package({ name, range, version: packageJson.version });

            this.packages.set(name, localPackage);

            this.taskManager.addTask(() => {
                return this.cache.wrap(name);
            });
        }
    }

    private async getLatestVersions() {
        for await (const packumentInfo of this.taskManager.run()) {
            const localPackage = this.packages.get(packumentInfo.name);

            if (packumentInfo instanceof TaskExecutionError) {
                const damagePackage = new DamagePackage({
                    name: packumentInfo.name,
                    damage: 'registry-fail',
                    error: packumentInfo,
                });

                this.packages.set(packumentInfo.name, damagePackage);
                continue;
            }

            if (localPackage instanceof Package) {
                localPackage.setPackument(packumentInfo);
            }
        }
    }
}
