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
            return new Promise<number>((resolve) => setTimeout(() => resolve(value), delay));
        });

        const taskManager = new TaskManager<number>(limit);

        for (let i = 0; i < taskCount; i += 1) {
            taskManager.addTask(() => mockFn(i));
        }

        const results: number[] = [];
        const executionGenerator = taskManager.run();

        let chunk = executionGenerator.next();

        jest.runAllTimers();

        let i = 0;
        while (i < taskCount) {
            const { value, done } = await chunk;

            if (done === true) break;

            if (!(value instanceof TaskExecutionError)) results.push(value);

            chunk = executionGenerator.next();
            i += 1;

            jest.advanceTimersByTime(delay);
        }

        expect(results).toEqual([0, 1, 2, 3, 4, 5]);

        jest.useRealTimers();
    });

    // test('should handle errors in tasks', async () => {
    //     const errorTask = async () => {
    //         throw new Error('Task failed');
    //     };

    //     taskManager.addTask(errorTask);

    //     const generator = taskManager.run();

    //     const results: (number | TaskExecutionError)[] = [];

    //     for await (const result of generator) {
    //         results.push(result);
    //     }

    //     expect(results).toHaveLength(1);
    //     expect(results[0]).toBeInstanceOf(TaskExecutionError);
    //     expect((results[0] as TaskExecutionError).message).toContain('Task failed');
    // });

    // test('should not allow adding tasks after starting execution', () => {
    //     const task = async () => 1;

    //     taskManager.run(); // Start execution

    //     expect(() => taskManager.addTask(task)).toThrow('The task execution process has already started');
    // });

    // test('should clear tasks after completion', async () => {
    //     const task1 = async () => 1;

    //     taskManager.addTask(task1);

    //     const generator = taskManager.run();

    //     await generator.next(); // Execute the first task

    //     expect(taskManager.tasks.size).toBe(0); // Tasks should be cleared after execution
    // });
});
