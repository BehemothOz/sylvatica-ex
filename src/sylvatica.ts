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

    constructor(private dependenciesManager: LocalDependenciesManager, private webviewPanel: WebviewPanel) {
        this.taskManager = new TaskManager();
    }

    async initialization() {
        for await (const dependencyVersion of this.dependenciesManager.getDependenciesVersions()) {
            this.taskManager.addTask(() => Promise.resolve(dependencyVersion));
        }

        this.webviewPanel.dispatcher.initialization();
    }
}
