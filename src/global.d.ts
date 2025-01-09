import * as semver from 'semver';

declare global {
    /**
     * A type representing the various types of damage that can occur to a package.
     *
     * * uninstall - the package has been uninstalled.
     * * unparsable - the package.json file could not be parsed.
     * * invalid - incorrect semver version
     * * registry-fail - there was a failure when accessing the registry.
     * * unknown - The type of damage is unknown.
     */
    export type DamageType = 'uninstall' | 'unparsable' | 'invalid' | 'registry-fail' | 'unknown';

    export interface PackageModel {
        /**
         * The name of the package.
         */
        name: string;
        /**
         * Acceptable version range from the package.json file
         */
        range: string;
        /**
         * The latest version of the package.
         */
        version: string;
        /**
         * The latest version of the package.
         */
        latestVersion: string;
        /**
         * The difference between the latest and current version (as ReleaseType)
         */
        diff: semver.ReleaseType | 'build' | null;
        /**
         * The homepage URL of the package, which is typically a link to the README file on GitHub.
         */
        homepage: string;
    }

    export interface DamagePackageModel {
        /**
         * The name of the damaged package.
         *
         */
        name: string;
        /**
         * The type of damage that has occurred to the package.
         * @type {DamageType}
         */
        damage: DamageType;

        /**
         * The error associated with the damage.
         */
        error: string;
    }
}

export {};
