interface PackumentResponse {
    name: string;
    version: string;
    homepage: string;
    description: string;
}

export class Packument {
    /**
     * The name of the package.
     */
    name: string;
    /**
     * The latest version of the package.
     */
    version: string;
    /**
     * The homepage URL of the package, which is typically a link to the README file on GitHub.
     */
    homepage: string;
    /**
     * A brief description of the package.
     */
    description: string;

    constructor(payload: PackumentResponse) {
        this.name = payload.name;
        this.version = payload.version;
        this.homepage = payload.homepage;
        this.description = payload.description;
    }
}
