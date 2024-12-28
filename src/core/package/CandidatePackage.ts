import { Package, type PackageLocalInfo, type PackageDocumentInfo } from './Package';
import { DamagePackage, type DamageType } from './DamagePackage';

export class CandidatePackage {
    private packageName: string;

    private localInfo: PackageLocalInfo | null = null;
    private packumentInfo: PackageDocumentInfo | null = null;

    constructor(packageName: string) {
        this.packageName = packageName;
    }

    setLocalPackageInfo(localInfo: PackageLocalInfo) {
        this.localInfo = localInfo;
        return this;
    }

    setPackument(packumentInfo: PackageDocumentInfo) {
        this.packumentInfo = packumentInfo;
        return this;
    }

    toPackage() {
        if (this.localInfo == null) throw new Error();
        if (this.packumentInfo == null) throw new Error();

        const formattedPackument = {
            latestVersion: this.packumentInfo.version,
            homepage: this.packumentInfo.homepage,
            description: this.packumentInfo.description,
        };

        const packageParams = Object.assign({ name: this.packageName }, formattedPackument, this.localInfo);

        return new Package(packageParams);
    }

    toDamage(damage: DamageType, error: Error) {
        return new DamagePackage({ name: this.packageName, damage, error });
    }
}
