import { TaskManager, TaskExecutionError } from './TaskManager';

describe('task-manager', () => {
    it('should add tasks to the queue for execution', () => {
        const taskManager = new TaskManager<number>();

        taskManager.addTask(() => Promise.resolve(1)).addTask(() => Promise.resolve(2));

        expect(taskManager.tasks.size).toBe(2);
    });

    it('should complete all tasks', async () => {
        jest.useFakeTimers();

        const limit = 3;
        const taskCount = 6;
        const delay = 10_000;

        const mockFn = jest.fn((value: number) => {
            return new Promise<number>((resolve, reject) => {
                setTimeout(() => {
                    if (value !== 0) resolve(value);
                    else {
                        const error = new Error('Task failed');
                        reject(error);
                    }
                }, delay);
            });
        });

        const taskManager = new TaskManager<number>(limit);

        for (let i = 0; i < taskCount; i += 1) {
            taskManager.addTask(() => mockFn(i));
        }

        const results: Array<number | TaskExecutionError> = [];
        const executionGenerator = taskManager.run();

        let chunk = executionGenerator.next();

        jest.runAllTimers();

        expect(mockFn.mock.calls).toHaveLength(limit);

        let i = 0;
        while (i < taskCount) {
            const { value, done } = await chunk;

            if (done === true) break;

            results.push(value);
            chunk = executionGenerator.next();

            i += 1;

            jest.advanceTimersByTime(delay);
        }

        expect(results).toHaveLength(taskCount);
        expect(results.at(0)).toBeInstanceOf(TaskExecutionError);
        expect(results.slice(1)).toEqual([1, 2, 3, 4, 5]);

        jest.useRealTimers();
    });

    // test('should not allow adding tasks after starting execution', () => {
    //     const task = async () => 1;

    //     taskManager.run(); // Start execution

    //     expect(() => taskManager.addTask(task)).toThrow('The task execution process has already started');
    // });
});
