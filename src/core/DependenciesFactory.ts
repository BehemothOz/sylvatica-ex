import { EventEmitter } from 'events';

import { TaskManager } from './TaskManager';
import { Package, type PackumentInfo } from './Package';

import { type DependencyInfo } from './LocalDependenciesManager';
import { type PackumentCache } from './PackumentCache';

export class DependenciesFactory {
    private taskManager: TaskManager;
    private emitter: EventEmitter;

    private cache: PackumentCache;
    private packages: Map<string, Package> = new Map();

    constructor(cache: PackumentCache) {
        this.cache = cache;

        this.taskManager = new TaskManager();
        this.emitter = new EventEmitter();
    }

    async analyze(dependencies: AsyncIterable<DependencyInfo>) {
        await this.getDependenciesInfo(dependencies);
        await this.getLatestVersions();

        this.emitter.emit('analyze-finished', Array.from(this.packages.values()));
    }

    on(cb: (packages: Package[]) => void) {
        this.emitter.on('analyze-finished', cb);
    }

    private async getDependenciesInfo(dependencies: AsyncIterable<DependencyInfo>) {
        for await (const dependency of dependencies) {
            const localPackage = new Package(dependency);

            this.packages.set(dependency.name, localPackage);

            this.taskManager.addTask(() => {
                return this.cache.wrap(dependency.name);
            });
        }
    }

    private async getLatestVersions() {
        /*
            TODO: fix types
        */
        for await (const packumentInfo of this.taskManager.run()) {
            const packument = (await packumentInfo) as PackumentInfo;
            const localPackage = this.packages.get(packument.name);

            if (localPackage) {
                localPackage.setPackument(packument);
            }
        }
    }
}
