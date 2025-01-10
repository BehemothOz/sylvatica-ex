import { Package, type PackageLocalInfo, type PackageDocumentInfo } from './Package';
import { DamagePackage } from './DamagePackage';

export type PackageType = Package | DamagePackage;

/**
 * Class representing a candidate package for processing.
 *
 * This class encapsulates information about a package, including its local and packument details,
 * and provides methods to convert it into a standard Package or a DamagePackage.
 */
export class CandidatePackage {
    private packageName: string;

    private localInfo: PackageLocalInfo | null = null;
    private packumentInfo: PackageDocumentInfo | null = null;

    /**
     * Creates an instance of CandidatePackage.
     *
     * @constructor
     * @param {string} packageName - The name of the package.
     */
    constructor(packageName: string) {
        this.packageName = packageName;
    }

    /**
     * Sets the local information about the package.
     * * The specified version range from the package.json
     * * The current version of node_modules
     *
     * @param {PackageLocalInfo} localInfo - The local information of the package.
     * @returns {CandidatePackage} The current instance for method chaining.
     */
    setLocalPackageInfo(localInfo: PackageLocalInfo): CandidatePackage {
        this.localInfo = localInfo;
        return this;
    }

    /**
     * Sets the packument information from registry.
     *
     * @param {PackageDocumentInfo} packumentInfo - The packument information of the package.
     * @returns {CandidatePackage} The current instance for method chaining.
     */
    setPackument(packumentInfo: PackageDocumentInfo): CandidatePackage {
        this.packumentInfo = packumentInfo;
        return this;
    }

    /**
     * Converts a candidate package into a Package instance.
     *
     * @throws {Error} Throws an error if local or packument information is not set.
     * @returns {Package} The constructed Package instance.
     */
    toPackage(): Package {
        if (this.localInfo == null)
            throw new Error(
                'Local package information is not set. Please ensure that you have called setLocalPackageInfo() with valid data.'
            );
        if (this.packumentInfo == null)
            throw new Error(
                'Packument information is not set. Please ensure that you have called setPackument() with valid data.'
            );

        const packageParams = Object.assign(
            {
                name: this.packageName,
                latestVersion: this.packumentInfo.version,
                homepage: this.packumentInfo.homepage,
                description: this.packumentInfo.description,
            },
            this.localInfo
        );

        return new Package(packageParams);
    }

    /**
     * Converts the candidate package to a DamagePackage instance.
     *
     * @param {{ damage: DamageType; error: Error }} params - An object containing damage type and error information.
     * @returns {DamagePackage} The constructed DamagePackage instance.
     */
    toDamage({ damage, error }: { damage: DamageType; error: Error }): DamagePackage {
        return new DamagePackage({ name: this.packageName, damage, error });
    }
}
