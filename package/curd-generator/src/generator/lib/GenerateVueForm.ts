import {GenerateItem} from "../GenerateItem";
import * as fs from "fs";
import * as  path from "path";
import {GetFileBasenameNoExt, toCamelCase} from "../../helper/PathHelper";
import {AbstractGenerator} from "./AbstractGenerator";

export class GenerateVueForm extends AbstractGenerator {
    reply!: string;

    constructor(item: GenerateItem) {
        super(item);
        this.reply = fs.readFileSync(path.join(__dirname, "../../../../template/vue.form.vue")).toString();
    }

    start() {
        this.addImport("__CLASS_NAME__Interface", `./${GetFileBasenameNoExt(this.INTERFACE_FILE_NAME)}`)
        this.addImport("__CLASS_NAME__ViewData", `./${GetFileBasenameNoExt(this.VUE_DATA_FILE_NAME)}`)

        this.reply = this.replace(this.reply);
        fs.writeFileSync(this.VUE_PATH, this.reply);
    }

    /** VUE 文件的名字 */
    get VUE_FILE_NAME(): string {
        // 数据只计算一次, 可以缓存
        if (this.DataCache["VUE_FILE_NAME"]) return this.DataCache["VUE_FILE_NAME"];
        let VUE_FILE_NAME = GetFileBasenameNoExt(this.item.output_backend_target)
        const Append = this.item.config.EntityPathAppend || "form.view";
        this.DataCache["VUE_FILE_NAME"] = `${toCamelCase(`${VUE_FILE_NAME}.${Append}`)}.vue`;
        return this.DataCache["VUE_FILE_NAME"] as string;
    }

    /** VUE 文件的路径 */
    get VUE_PATH(): string {
        // 数据只计算一次, 可以缓存
        if (this.DataCache["VUE_PATH"]) return this.DataCache["VUE_PATH"];
        this.DataCache["VUE_PATH"] = path.join(this.TARGET_FRONTEND_DIR, this.VUE_FILE_NAME);
        return this.DataCache["VUE_PATH"] as string;
    }

}