import * as url from 'url';

/*
    auth key
    https://github.com/rexxars/registry-auth-token/blob/main/index.js

    const bearerAuth = getBearerToken(npmrc.get(regUrl + tokenKey) || npmrc.get(regUrl + '/' + tokenKey))
*/

export class AuthorizationRegistry {
    private rcConfig: Record<string, string>;

    static tokenKey = ':_authToken';

    constructor(rcConfig: Record<string, string>) {
        this.rcConfig = rcConfig;
        console.log('process.env', process.env);
    }

    public getAuthorizationInfo(registryUrl: string) {
        const parsedRegistryUrl = url.parse(registryUrl);

        let currentPathname = parsedRegistryUrl.pathname;
        let pathname = currentPathname;

        while (pathname !== '/') {
            pathname = currentPathname ?? '/';

            const authorizationUrl = '//' + parsedRegistryUrl.host + pathname.replace(/\/$/, '');
            console.log(authorizationUrl);

            currentPathname = url.resolve(this.normalizePath(pathname), '..') || '/';
        }
    }

    private findAuthorizationToken(authorizationUrl: string) {
        // regUrl + tokenKey or regUrl + '/' + tokenKey

        const authorizationUrlWithToken = authorizationUrl + '/' + AuthorizationRegistry.tokenKey;
        const token = this.rcConfig[authorizationUrlWithToken];

        return this.getBearerToken(token);
    }

    private getBearerToken(token?: string) {
        if (token) {
            return {
                token: this.replaceEnvironmentVariable(token),
            };
        }
    }

    private replaceEnvironmentVariable(token: string) {
        return token.replace(/^\$\{?([^}]*)\}?$/, (_substring: string, key) => {
            return process.env[key] ?? '';
        });
    }

    private normalizePath(url: string): string {
        return url.slice(-1) === '/' ? url : `${url}/`;
    }
}
