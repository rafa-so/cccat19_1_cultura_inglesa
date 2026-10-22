import crypto from "crypto";

export default class UUID {
    private value: string;
    
    constructor(uuid: string) {
        // FIXME: Criar regex para validar o UUID
        this.value = uuid;
    }

    static create() {
        const uuid = crypto.randomUUID();
        return new UUID(uuid);
    }

    getValue() {
        return this.value;
    }
}
