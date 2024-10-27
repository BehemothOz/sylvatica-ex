import * as semver from 'semver';

function semverDiff(versionA: any, versionB: any) {
    versionA = semver.parse(versionA);
    versionB = semver.parse(versionB);

    if (semver.compareBuild(versionA, versionB) >= 0) {
        return;
    }

    /*
        diff(v1, v2): Returns the difference between two versions by
        the release type (major, premajor, minor, preminor, patch, prepatch, or prerelease),
        or null if the versions are the same.
        + build
    */
    return semver.diff(versionA, versionB) || 'build';
}

const data = [
    {
        name: 'axios',
        current: '1.6.0',
        last: '1.8.0',
    },
    {
        name: 'jquery',
        current: '3.5.0',
        last: '3.5.5',
    },
    {
        name: 'lodash',
        current: '4.17.10',
        last: '5.1.10',
    },
    {
        name: 'react',
        current: '16.14.0',
        last: '18.15.0',
    },
];

/*
    1. Major Release (1.0 -> 2.0)
    2. Premajor Release (1.0.0 -> 1.0.0-alpha)
    3. Minor Release (1.0 -> 1.1)
    4. Preminor Release
    5. Patch Release (1.0.0 -> 1.0.1)
    6. Prepatch Release 
    7. Prerelease (2.0-rc - release candidate)
*/

export function comparison() {
    for (const item of data) {
        const gt = semver.gt(item.current, item.last);

        const currentIsValid = semver.valid(item.current);
        const lastIsValid = semver.valid(item.last);

        const usingNonSemver = semver.valid(item.last) && semver.lt(item.last, '1.0.0-pre');

        const bump =
            semver.valid(item.last) &&
            semver.valid(item.current) &&
            (usingNonSemver && semverDiff(item.current, item.last) ? 'nonSemver' : semverDiff(item.current, item.last));

        // console.log({
        //     _name: item.name,
        //     gt,
        //     currentIsValid,
        //     lastIsValid,
        //     usingNonSemver,
        //     bump,
        // });
    }

    /*
        "major" | "premajor" | "minor" | "preminor" | "patch" | "prepatch" | "prerelease"
    */
    const a = semver.inc('1.2.3', 'major', 'xyz'); // 2.0.0
    const b = semver.inc('1.2.3', 'premajor', 'xyz'); // 2.0.0-xyz.0
    const c = semver.inc('1.2.3', 'minor', 'xyz'); // 1.3.0
    const d = semver.inc('1.2.3', 'preminor', 'xyz'); //  1.3.0-xyz.0
    const e = semver.inc('1.2.3', 'patch', 'xyz');
    const f = semver.inc('1.2.3', 'prepatch', 'xyz');
    const i = semver.inc('1.2.3', 'prerelease', 'xyz');

    console.log('major', a);
    console.log('premajor', b);
    console.log('minor', c);
    console.log('preminor', d);
    console.log('patch', e);
    console.log('prepatch', f);
    console.log('prerelease', i);

    console.log('===================');
    console.log(semver.diff('1.2.3', '2.0.0-xyz.0'));

    const sorted = data.sort((a, b) => {
        return semver.compare(a.last, b.last);
    });

    // console.log(sorted);
}
