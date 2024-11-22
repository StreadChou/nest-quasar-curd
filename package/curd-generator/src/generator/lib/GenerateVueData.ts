import {GenerateItem} from "../GenerateItem";
import * as fs from "fs";
import * as  path from "path";
import {GetFileBasenameNoExt, toCamelCase} from "../../helper/PathHelper";
import {GenerateVueHome} from "./GenerateVueHome";
import {ColumnsDefineFronted, ColumnsType} from "../../constant";
import {AbstractGenerator} from "./AbstractGenerator";

export class GenerateVueData extends AbstractGenerator {
    reply!: string;

    constructor(item: GenerateItem) {
        super(item);
        this.reply = fs.readFileSync(path.join(__dirname, "../../../../template/vue.data.temp")).toString();
    }

    start() {
        this.addImport("__CLASS_NAME__Interface", `./${GetFileBasenameNoExt(this.INTERFACE_FILE_NAME)}`)

        this.reply = this.reply.replace(/__COLUMNS_DEFINE__/g, JSON.stringify(this.COLUMNS_DEFINE,))
        this.reply = this.reply.replace(/__COLUMNS_GRIDS__/g, JSON.stringify(this.COLUMNS_GRIDS))
        this.reply = this.reply.replace(/__HOME_SHOW_COLUMNS__/g, JSON.stringify(this.HOME_SHOW_COLUMNS,))
        this.reply = this.reply.replace(/__CREATE_SHOW_COLUMNS__/g, JSON.stringify(this.CREATE_SHOW_COLUMNS,))
        this.reply = this.reply.replace(/__UPDATE_SHOW_COLUMNS__/g, JSON.stringify(this.UPDATE_SHOW_COLUMNS,))


        this.reply = this.replace(this.reply);
        fs.writeFileSync(this.VUE_DATA_PATH, this.reply);
    }


    get VUE_DATA_PATH() {
        // 数据只计算一次, 可以缓存
        if (this.DataCache["VUE_DATA_PATH"]) return this.DataCache["VUE_DATA_PATH"];
        this.DataCache["VUE_DATA_PATH"] = path.join(this.TARGET_FRONTEND_DIR, this.VUE_DATA_FILE_NAME);
        return this.DataCache["VUE_DATA_PATH"] as string;
    }


    get HOME_SHOW_COLUMNS() {
        // 数据只计算一次, 可以缓存
        if (this.DataCache["HOME_SHOW_COLUMNS"]) return this.DataCache["HOME_SHOW_COLUMNS"];
        this.DataCache["HOME_SHOW_COLUMNS"] = [];

        for (const columns of this.item.config.columns) {
            if (columns.frontend?.show_at_home) {
                this.DataCache["HOME_SHOW_COLUMNS"].push(columns.key);
            }
        }

        return this.DataCache["HOME_SHOW_COLUMNS"] as string[];
    }


    get COLUMNS_DEFINE() {
        // 数据只计算一次, 可以缓存
        if (this.DataCache["COLUMNS_DEFINE"]) return this.DataCache["COLUMNS_DEFINE"];
        let data: ColumnsDefineFronted = {};
        for (let col of this.item.config.columns) {
            data[col.key] = {
                key: col.key,
                label: col.label,
                mark: col.mark,
                type: col.type,
                type_extension: col.type_extension,
                frontend: col.frontend,
            }
        }
        this.DataCache["COLUMNS_DEFINE"] = data;
        return this.DataCache["COLUMNS_DEFINE"] as ColumnsDefineFronted;
    }


    get CREATE_SHOW_COLUMNS() {
        // 数据只计算一次, 可以缓存
        if (this.DataCache["CREATE_SHOW_COLUMNS"]) return this.DataCache["CREATE_SHOW_COLUMNS"];
        this.DataCache["CREATE_SHOW_COLUMNS"] = [];

        for (const columns of this.item.config.columns) {
            if (columns.frontend?.hidden_at_create) {

            } else {
                this.DataCache["CREATE_SHOW_COLUMNS"].push(columns.key);
            }
        }

        return this.DataCache["CREATE_SHOW_COLUMNS"] as string[];
    }

    get UPDATE_SHOW_COLUMNS() {
        // 数据只计算一次, 可以缓存
        if (this.DataCache["UPDATE_SHOW_COLUMNS"]) return this.DataCache["UPDATE_SHOW_COLUMNS"];
        this.DataCache["UPDATE_SHOW_COLUMNS"] = [];

        for (const columns of this.item.config.columns) {
            if (columns.frontend?.hidden_at_update) {

            } else {
                this.DataCache["UPDATE_SHOW_COLUMNS"].push(columns.key);
            }
        }

        return this.DataCache["UPDATE_SHOW_COLUMNS"] as string[];
    }


    get COLUMNS_GRIDS() {
        // 数据只计算一次, 可以缓存
        if (this.DataCache["COLUMNS_GRIDS"]) return this.DataCache["COLUMNS_GRIDS"];
        const form_grid = this.item.config?.frontend?.form_grid || [];
        if (form_grid.length <= 0) {
            this.DataCache["COLUMNS_GRIDS"] = [];
            for (let col of this.item.config.columns) {
                if (col.type == ColumnsType.computed) continue;
                this.DataCache["COLUMNS_GRIDS"].push(col.key);
            }
            return this.DataCache["COLUMNS_GRIDS"] as Array<string | Array<string>>;
        }

        let allKeys: Array<string> = [];
        for (const grid of form_grid) {
            if (typeof grid == "string") allKeys.push(grid)
            if (Array.isArray(grid)) allKeys = allKeys.concat(grid);
        }

        let other_keys: Array<string> = [];
        if (allKeys.includes("__OTHER__")) {
            for (const col of this.item.config.columns) {
                if (col.type == ColumnsType.computed) continue;
                if (allKeys.includes(col.key)) continue;
                other_keys.push(col.key);
            }
        }

        this.DataCache["COLUMNS_GRIDS"] = [];
        for (const grid of form_grid) {
            if (grid == "__OTHER__") {
                for (const key of other_keys) {
                    this.DataCache["COLUMNS_GRIDS"].push(key)
                }
            } else {
                this.DataCache["COLUMNS_GRIDS"].push(grid);
            }
        }
        return this.DataCache["COLUMNS_GRIDS"] as Array<string | Array<string>>;
    }
}