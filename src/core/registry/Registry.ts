import * as vscode from 'vscode';
import * as path from 'path';
import ini from 'ini';

import { AuthorizationRegistry } from './AuthorizationRegistry';
import { fm } from '../FileManager';

/*
    More: https://docs.npmjs.com/cli/v10/using-npm/registry

    # main registry
    registry=https://registry.npmjs.org/

    # registry with scope
    @my-org:registry=https://registry.my-org.com/
*/

export class Registry {
    config: Record<string, string>;
    authorizationRegistry: AuthorizationRegistry;

    constructor(config: Record<string, string>) {
        this.config = config;
        this.authorizationRegistry = new AuthorizationRegistry(this.config);
    }

    static async build(directoryPath: string) {
        const rc_path = path.join(directoryPath, '.npmrc');
        console.log(rc_path, directoryPath);
        const rcFilePath = vscode.Uri.file(rc_path);

        console.log(rcFilePath);

        const defaultConfig = { registry: 'https://registry.npmjs.org/' };

        if (fm.exist(rcFilePath)) {
            try {
                const rcFile = await fm.readFile(rcFilePath);
                const parsedRcFile = ini.parse(rcFile);

                return new Registry(Object.assign({}, defaultConfig, parsedRcFile));
            } catch (error) {
                console.error(error);
                return new Registry(defaultConfig);
            }
        } else {
            return new Registry(defaultConfig);
        }
    }

    public getRegistryUrl(scope?: string) {
        const registryUrl = this.getRegistryUrlByScope(scope) ?? this.config['registry'];
        const token = this.authorizationRegistry.getAuthorizationInfo(registryUrl);

        return {
            registry: this.normalizePath(registryUrl),
            token: token,
        };
    }

    private getRegistryUrlByScope(scope?: string): string | undefined {
        if (scope) {
            return this.config[`${scope}:registry`];
        }
    }

    private normalizePath(url: string): string {
        return url.slice(-1) === '/' ? url : `${url}/`;
    }
}
