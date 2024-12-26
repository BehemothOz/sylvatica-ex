import { Package, type LocalPackageInfo, type PackumentInfo } from './Package';
import { DamagePackage, type DamageType } from './DamagePackage';

export class LocalIncompletePackage {
    localInfo: LocalPackageInfo;
    packumentInfo: PackumentInfo | null = null;

    constructor(payload: LocalPackageInfo) {
        this.localInfo = payload;
    }

    setPackument(packumentInfo: PackumentInfo) {
        this.packumentInfo = packumentInfo;
        return this;
    }

    toPackage() {
        if (this.packumentInfo == null) {
            throw new Error();
        }

        const formattedPackument = {
            latestVersion: this.packumentInfo.version,
            homepage: this.packumentInfo.homepage,
            description: this.packumentInfo.description,
        };

        return new Package(Object.assign(formattedPackument, this.localInfo));
    }

    toDamage(damage: DamageType, error: Error) {
        return new DamagePackage({ name: this.localInfo.name, damage, error });
    }
}
