const fs = require("fs");
const { set, get, unset } = require("lodash");

class Database {
    constructor(name = "database") 
    {
        let path = "Database";
        if(!fs.existsSync('Database')) {
            fs.mkdirSync('Database')
        }
        if(!fs.existsSync(path + "/" + name + ".json")) {
            fs.writeFileSync(path + "/" + name + ".json", "{}")
        }
        this.path = path + "/" + name + ".json";
    }

    set(path, value) {
        if (path === "" || typeof path !== "string") {
            throw new Error("Geçersiz dosya")
        }
        if(value === ""|| value === undefined || value === null) {
            throw new Error("Geçersiz değer!")
        }

        const data = this.toJSON();
        set(data, path, value)
        fs.writeFileSync(this.path, JSON.stringify(data, null, 4));
        return value;
    }
    get(path) {
        if (path === "" || typeof path !== "string") {
            throw new Error("Geçersiz dosya!");
        }
        const jdata = this.toJSON();
        const data = get(jdata, path);
        return data;
    }
    fetch(value) {
        return this.get(value);
    }
    exists(path) {
        return this.toJSON().hasOwnProperty(path);
    }
    has(path) {
        return this.toJSON().hasOwnProperty(path);
    }
    toJSON(limit) {
        const allData = this.all(limit);
        const json = {};
        for (const element of allData) {
            json[element.ID] = element.data;
        }
        return json;
    }
    all(limit = 0) {
        if (typeof limit !== "number") {
            throw new Error("Sayı girmelisin");
        }
        const data = JSON.parse(fs.readFileSync(this.path, "utf-8"));
        const arr = [];
        for (const key in data) {
            arr.push({
                ID: key,
                data: data[key]
            });
        }
        return limit > 0 ? arr.splice(0, limit) : arr;
    }
    delete(path) {
        if (path === "" || typeof path !== "string") {
            throw new Error("Geçersiz anahtar!");
        }
        const data = this.toJSON();

        unset(data, path);

        fs.writeFileSync(this.path, JSON.stringify(data, null, 4));
        return;
    }
    deleteAll() {
        fs.writeFileSync(this.path, "{}");
        return;
    }
    add(path, value) {
        
        if (Array.isArray(value) || isNaN(value)) {
            throw new Error(`Bu değer sayı değil.`);
        }
        
        if(value <= 0) throw new Error("Değer 1'den az olamaz")

        let data = this.get(path);

        if(!data) {
            return this.set(path, value);
        }
        if (Array.isArray(data) || isNaN(data)) throw new Error(`${path} bu bir sayı anahtarı değil.`);

        data = Number(data);
        data += value;
        return this.set(path, data)
    }
    substr(path, value, goToNegative = false) {
        
        if (Array.isArray(value) || isNaN(value)) {
            throw new Error(`Değer bir sayı değil.`);
        }
        
        if(value <= 0) throw new Error("Değer 1'den az olamaz")

        let data = this.get(path);
        if (typeof goToNegative !== "boolean") throw new Error(`The goToNegative parameter must be of boolean type.`);
        if(!data && data != 0) {
            return this.set(path, value);
        }
        if (Array.isArray(data) || isNaN(data)) throw new Error(`${path} bu bir sayı anahtarı değil.`);

        data = Number(data);
        data -= value
        if (goToNegative === false && data < 1) data = 0;
        return this.set(path, data)
    }

}

module.exports = {Database};