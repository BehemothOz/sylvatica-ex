interface PackumentResponse {
    version: string;
    homepage: string;
    description: string;
}

interface PackagePayload extends PackumentResponse {
    name: string;
    lastVersion: string;
}

export class PackageBuilder {
    private name!: string;
    private version!: string;
    private packument!: PackumentResponse;

    setName(name: string): this {
        this.name = name;
        return this;
    }

    addVersion(version: string): this {
        this.version = version;
        return this;
    }

    addPackument(packument: PackumentResponse): this {
        this.packument = packument;
        return this;
    }

    build(): Package {
        return new Package({
            name: this.name,
            version: this.version,
            lastVersion: this.packument.version,
            homepage: this.packument.version,
            description: this.packument.version,
        });
    }
}

export class Package {
    /**
     * The name of the package.
     */
    name: string;
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
    homepage: string;
    /**
     * A brief description of the package.
     */
    description: string;

    constructor(payload: PackagePayload) {
        this.name = payload.name;
        this.version = payload.version;
        this.homepage = payload.homepage;
        this.description = payload.description;
    }
}
