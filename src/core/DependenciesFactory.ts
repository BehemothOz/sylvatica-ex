import { EventEmitter } from 'events';

import { TaskManager } from './task-manager';
import { CandidatePackage, type PackageType } from './package';
import { type PackumentCache, type PackumentWrappedValue, type PackumentWrappedErrorValue } from './packument-service';

import { MissingPackageJsonError, type LocalDependencyResult } from './LocalDependenciesManager';
import { PackageJsonParseError } from './PackageJsonReader';

export class DependenciesFactory {
    private taskManager: TaskManager<PackumentWrappedValue, PackumentWrappedErrorValue>;
    private emitter: EventEmitter;

    private cache: PackumentCache;
    private packages: Map<string, CandidatePackage | PackageType> = new Map();

    /**
     * Creates an instance of DependenciesFactory.
     *
     * @constructor
     * @param {PackumentCache} cache - The cache used for storing packument data.
     */
    constructor(cache: PackumentCache) {
        this.cache = cache;

        this.taskManager = new TaskManager();
        this.emitter = new EventEmitter();
    }

    /**
     * Analyzes dependencies and retrieves their local and remote information.
     *
     * @async
     * @param {AsyncIterable<LocalDependencyResult>} localDependencies - An iterable of local dependency results to analyze.
     */
    async analyze(localDependencies: AsyncIterable<LocalDependencyResult>) {
        try {
            await this.getDependenciesInfo(localDependencies);
            await this.getLatestVersions();

            this.emitter.emit('analyze-finished', Array.from(this.packages.values()));
        } catch (error) {
            /*
                TODO: Abort the analysis process and send an error.
            */
            console.error(error);
        }
    }

    /**
     * Registers a callback to be called when the analysis is finished.
     *
     * @param {(packages: Array<PackageType>) => void} cb - The callback function to execute upon completion of the analysis.
     */
    on(cb: (packages: Array<PackageType>) => void) {
        this.emitter.on('analyze-finished', cb);
    }

    /*
        TODO: Ignoring invalid ranges
    */
    /**
     * Retrieves information about local dependencies.
     * This method processes each local dependency result, creating CandidatePackage instances
     * or DamagePackage instances based on the status of each dependency.
     *
     * @async
     * @param {AsyncIterable<LocalDependencyResult>} localDependencies - An iterable of local dependency results to process.
     */
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

    /**
     * Retrieves the latest versions of the packages from the task manager and updates the packages map.
     *
     * This method processes each packument information retrieved by the task manager,
     * converting CandidatePackages into standard Packages or updating them with damage information as necessary.
     *
     * @async
     */
    private async getLatestVersions() {
        for await (const packumentInfo of this.taskManager.run()) {
            const { status, payload } = packumentInfo;
            const { key: packageName } = payload;

            const candidatePackage = this.packages.get(packageName);

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
