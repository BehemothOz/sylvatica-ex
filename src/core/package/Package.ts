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
    latestVersion: string | null = null;
    /**
     * TODO: ...
     */
    diff: semver.ReleaseType | 'build' | null = null;
    /**
     * The homepage URL of the package, which is typically a link to the README file on GitHub.
     */
    homepage: string | null = null;
    /**
     * A brief description of the package.
     */
    description: string | null = null;

    constructor(payload: PackagePayload) {
        /*
            Local dependency info
        */
        this.name = payload.name;
        this.range = payload.range;
        this.version = payload.version;
        /*
            Remote packument info
        */
        this.latestVersion = payload.version;
        this.homepage = payload.homepage;

        this.getVersionDifference();
    }

    /*
        TODO: check semver.lt(latest, '1.0.0-pre');
    */
    private getVersionDifference() {
        if (this.latestVersion && semver.valid(this.version) && semver.valid(this.latestVersion)) {
            this.diff = semverDiff(this.version, this.latestVersion);
        }
        /*
            TODO: md "wrong"?
        */
    }
}

/*
    Source:
    * https://github.com/npm/node-semver
    * https://github.com/sindresorhus/semver-diff
*/
function semverDiff(versionA: string, versionB: string) {
    /*
        Return 0 if v1 == v2, or 1 if v1 is greater, or -1 if v2 is greater.
    */
    if (semver.compareBuild(versionA, versionB) >= 0) return null;
    /*
        diff(v1, v2): Returns the difference between two versions by
        the release type (major, premajor, minor, preminor, patch, prepatch, prerelease) or null if the versions are the same.

        Build example: semverDiff('0.0.1', '0.0.1+foo.bar') // 'build'
    */
    return semver.diff(versionA, versionB) || 'build';
}

class LocalIncompletePackage {
    localInfo: PackagePayload;
    packumentInfo: PackumentInfo | null = null;

    constructor(payload: PackagePayload) {
        this.localInfo = payload;
    }

    setPackument(packumentInfo: PackumentInfo) {
        this.packumentInfo = packumentInfo;
    }

    toPackage() {
        if (this.packumentInfo == null) {
            throw new Error();
        }

        return new Package(Object.assign({}, this.localInfo, this.packumentInfo));
    }
}
