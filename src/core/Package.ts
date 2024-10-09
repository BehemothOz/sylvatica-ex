import * as semver from 'semver';

export interface PackumentInfo {
    name: string;
    version: string;
    homepage: string;
    description: string;
}

interface PackagePayload {
    name: string;
    range: string;
    version: string;
}

export class Package {
    /**
     * The name of the package.
     */
    name: string;
    /**
     * TODO: ...
     */
    range: string;
    /**
     * The latest version of the package.
     */
    version: string;
    /**
     * The latest version of the package.
     */
    lastVersion: string | null = null;
    /**
     * The homepage URL of the package, which is typically a link to the README file on GitHub.
     */
    homepage: string | null = null;
    /**
     * A brief description of the package.
     */
    description: string | null = null;

    constructor(payload: PackagePayload) {
        this.name = payload.name;
        this.range = payload.range;
        this.version = payload.version;
    }

    setPackument(packumentInfo: PackumentInfo) {
        this.lastVersion = packumentInfo.version;
        this.homepage = packumentInfo.homepage;
        this.description = packumentInfo.description;
    }

    private getReleaseType() {
        const currentIsValid = semver.valid(this.version);
        const lastIsValid = semver.valid(this.lastVersion);
    }

    private checkVersionIsValidSemver(version: string) {
        return semver.valid(this.lastVersion);
    }
}
