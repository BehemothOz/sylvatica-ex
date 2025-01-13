import * as vscode from 'vscode';
import * as url from 'url';
import ini from 'ini';

import { fm } from './FileManager';

/*
    More: https://docs.npmjs.com/cli/v10/using-npm/registry

    # main registry
    registry=https://registry.npmjs.org/

    # registry with scope
    @my-org:registry=https://registry.my-org.com/
*/

/*
    auth key
    https://github.com/rexxars/registry-auth-token/blob/main/index.js

    const bearerAuth = getBearerToken(npmrc.get(regUrl + tokenKey) || npmrc.get(regUrl + '/' + tokenKey))
*/

export class Registry {
    config: Record<string, string>;

    constructor(config: Record<string, string>) {
        this.config = config;
    }

    // url = new URL("https://registry.npmjs.org/parent/qwerty/")

    static async build(directoryPath: vscode.Uri) {
        const rcFilePath = fm.joinPath(directoryPath, '.npmrc');

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

        return this.normalizePath(registryUrl);
    }

    private getRegistryUrlByScope(scope?: string): string | undefined {
        if (scope) {
            return this.config[`${scope}:registry`];
        }
    }

    private getAuthorizationInfo(registryUrl: string) {
        const parsedRegistryUrl = url.parse(registryUrl);

        let currentPathname = parsedRegistryUrl.pathname;
        let pathname = '';

        // do while ?

        while (pathname !== '/') {
            pathname = currentPathname ?? '/';

            const authorizationUrl = '//' + parsedRegistryUrl.host + pathname.replace(/\/$/, '');
            console.log(authorizationUrl);

            currentPathname = url.resolve(this.normalizePath(pathname), '..') || '/';
        }
    }

    private normalizePath(url: string): string {
        return url.slice(-1) === '/' ? url : `${url}/`;
    }
}
