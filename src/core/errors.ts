export class MissingNodeModulesError extends Error {
    constructor(directoryPath: string) {
        super(`Directory "node_modules" is missing in "${directoryPath}".`);

        this.name = 'MissingNodeModulesError';
    }
}

export class PackageJsonParseError extends Error {
    constructor(filePath: string, originalError?: Error) {
        super(`Failed to parse package.json at "${filePath}": ${originalError?.message}`);

        this.name = 'PackageJsonParseError';

        if (originalError) {
            this.stack = originalError.stack;
        }
    }
}
