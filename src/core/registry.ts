// import rc from 'rc';

/*
    # .npmrc
    @myco:registry = 'https://custom-registry.com/'
    import registryUrl from 'registry-url';

    console.log(registryUrl('@myco'));
    => 'https://custom-registry.com/'
*/
// export default function registryUrl(scope) {
//     const result = rc('npm', { registry: 'https://registry.npmjs.org/' });
//     const url = result[`${scope}:registry`] || result.config_registry || result.registry;
//     return url.slice(-1) === '/' ? url : `${url}/`;
// }

// module.exports = function getRegistryUrl (scope, npmrc) {
//     const rc = npmrc ? { config: { get: (key) => npmrc[key] } } : npmConf()
//     const url = rc.config.get(scope + ':registry') || rc.config.get('registry') || npmConf.defaults.registry
//     return url.slice(-1) === '/' ? url : url + '/'
//   }

/*
    registry=https://registry.npmjs.org/
    always-auth=true
    _authToken=YOUR_TOKEN_HERE
    username=myUsername
    password=myPassword
    proxy=http://my-proxy.com
    https-proxy=https://my-proxy.com
    strict-ssl=false
    cache=${HOME}/.npm-cache
    save-exact=true
*/

/*
    # Основной реестр для всех пакетов  
    registry=https://registry.npmjs.org/  

    # Реестр для пакетов из определенного скоупа  
    @my-org:registry=https://registry.my-org.com/  
*/

/*
    В одном файле .npmrc можно указать как общий реестр для всех пакетов, так и специализированные реестры для определённых скоупов. Однако npm обрабатывает эти правила по определенной логике.

Приоритетность настроек .npmrc
Общий реестр: Если в файле .npmrc указан общий реестр с помощью строки registry, как в следующем примере:

registry=https://registry.npmjs.org/  
Это будет являться основным реестром для всех пакетов, которые не имеют указания на другой реестр.

Скоупы: Если вы указываете специализированный реестр для пакетов с определённым скоупом, используя синтаксис:

@my-org:registry=https://registry.my-org.com/  
npm будет использовать указанный реестр только для пакетов, которые попадают под этот скоуп (например, @my-org/package-name).
*/

/*
    получение ключа auth
    https://github.com/rexxars/registry-auth-token/blob/main/index.js

     const bearerAuth = getBearerToken(npmrc.get(regUrl + tokenKey) || npmrc.get(regUrl + '/' + tokenKey))
*/
