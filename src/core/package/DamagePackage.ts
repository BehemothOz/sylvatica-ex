interface DamagePackagePayload {
    name: string;
    damage: DamageType;
    error: Error;
}

/**
 * Interface representing the payload for a DamagePackage.
 *
 * This payload contains information about the damaged package, including its name,
 * the type of damage, and any associated error.
 */
export class DamagePackage implements DamagePackageModel {
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
    error: Error;

    /**
     * Creates an instance of DamagePackage.
     *
     * @constructor
     * @param {DamagePackagePayload} payload - The payload containing information about the damaged package.
     */
    constructor(payload: DamagePackagePayload) {
        this.name = payload.name;
        this.damage = payload.damage;
        this.error = payload.error;
    }
}
