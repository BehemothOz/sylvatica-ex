import { TaskManager } from './core/TaskManager';
import { type LocalDependenciesManager } from './core/LocalDependenciesManager';

export class Sylvatica {
    taskManager: TaskManager;

    constructor(private dependenciesManager: LocalDependenciesManager) {
        this.taskManager = new TaskManager();
    }

    async initialization() {
        for await (const dependencyVersion of this.dependenciesManager.getDependenciesVersions()) {
            this.taskManager.addTask(() => Promise.resolve(dependencyVersion));
        }
    }
}
