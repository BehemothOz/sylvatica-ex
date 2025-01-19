import * as url from 'url';

/*
    auth key
    https://github.com/rexxars/registry-auth-token/blob/main/index.js

    const bearerAuth = getBearerToken(npmrc.get(regUrl + tokenKey) || npmrc.get(regUrl + '/' + tokenKey))

    TODO: If environment variable

    regexp: /^\$\{?([^}]*)\}?$/
*/

export class AuthorizationRegistry {
    private rcConfig: Record<string, string>;

    static tokenKey = ':_authToken';

    constructor(rcConfig: Record<string, string>) {
        this.rcConfig = rcConfig;
    }

    public getAuthorizationInfo(registryUrl: string) {
        const parsedRegistryUrl = url.parse(registryUrl);

        let currentPathname = parsedRegistryUrl.pathname;
        let pathname = currentPathname;

        while (pathname !== '/') {
            pathname = currentPathname ?? '/';

            const authorizationUrl = '//' + parsedRegistryUrl.host + pathname.replace(/\/$/, '');
            const token = this.findAuthorizationToken(authorizationUrl);

            if (token) return token;

            currentPathname = url.resolve(this.normalizePath(pathname), '..') || '/';
        }

        return null;
    }

    private findAuthorizationToken(authorizationUrl: string) {
        // regUrl + tokenKey or regUrl + '/' + tokenKey

        const authorizationUrlWithToken = authorizationUrl + '/' + AuthorizationRegistry.tokenKey;
        const token = this.rcConfig[authorizationUrlWithToken];

        if (token) return token;
        return null;
    }

    private normalizePath(url: string): string {
        return url.slice(-1) === '/' ? url : `${url}/`;
    }
}
