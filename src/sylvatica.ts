import { TaskManager } from './core/TaskManager';
import { type WebviewPanel } from './core/webview';
import { type LocalDependenciesManager } from './core/LocalDependenciesManager';

const sendRequest = async (id: number) => {
    // https://registry.npmjs.org/date-fns/latest
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    return await response.json();
};

export class Sylvatica {
    taskManager: TaskManager;

    constructor(
        private dependenciesManager: LocalDependenciesManager,
        private webviewPanel: WebviewPanel | null = null
    ) {
        this.taskManager = new TaskManager();
    }

    async initialization() {
        // this.webviewPanel.create();

        for await (const dependencyVersion of this.dependenciesManager.getDependenciesVersions()) {
            this.taskManager.addTask(() => Promise.resolve(dependencyVersion));
        }
    }
}
