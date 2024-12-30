import { PackageManagerDetector } from './Detector';
import { PackageManagerContext } from './PackageManagerContext';

export class PackageManagerService {
    private context: PackageManagerContext;

    constructor() {
        this.context = new PackageManagerContext();
    }

    async getPackageManager(directoryPath: string) {
        const packageManagerName = await PackageManagerDetector.detect(directoryPath);

        if (packageManagerName) {
            return this.context.use(packageManagerName);
        }

        return null;
    }
}
