type DamageType = 'uninstall' | 'unparsable' | 'invalid' | 'registry-fail';

interface DamagePackagePayload {
    name: string;
    /*
        ...
    */
    damage: DamageType;
    error: Error;
}

/*
    1. Отсутствуют node_modules

    2. Зависимость не найдена в node_modules

    3. Зависимость найдена в node_modules, но произошла ошибка при parse package.json

    4. Игнорируем не валидные диапазоны ... TODO

    ---- Если все хорошо на этом этапе, мы можем собрать локальную информацию о зависимости

    ---- Этап получения последней версии

    5. Ошибка получения
*/

export class DamagePackage {
    name: string;

    damage: DamageType;

    error: Error;

    constructor(payload: DamagePackagePayload) {
        this.name = payload.name;
        this.damage = payload.damage;
        this.error = payload.error;
    }
}
