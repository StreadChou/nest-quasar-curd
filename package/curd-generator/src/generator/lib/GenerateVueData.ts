import {GenerateItem} from "../GenerateItem";
import * as fs from "fs";
import * as  path from "path";
import {GetFileBasenameNoExt} from "../../helper/PathHelper";
import {ColumnsType} from "../../link/index";
import {AbstractGenerator} from "./AbstractGenerator";

export class GenerateVueData extends AbstractGenerator {
    reply!: string;

    constructor(item: GenerateItem) {
        super(item);
        this.reply = fs.readFileSync(path.join(__dirname, "../../../template/vue.data.temp")).toString();
    }

    start() {
        this.addImport("__CLASS_NAME__Interface", `./${GetFileBasenameNoExt(this.INTERFACE_FILE_NAME)}`)

        // this.reply = this.reply.replace(/__COLUMNS_DEFINE__/g, JSON.stringify(this.COLUMNS_DEFINE,))
        // this.reply = this.reply.replace(/__COLUMNS_GRIDS__/g, JSON.stringify(this.COLUMNS_GRIDS))
        // this.reply = this.reply.replace(/__HOME_SHOW_COLUMNS__/g, JSON.stringify(this.HOME_SHOW_COLUMNS,))
        // this.reply = this.reply.replace(/__CREATE_SHOW_COLUMNS__/g, JSON.stringify(this.CREATE_SHOW_COLUMNS,))
        // this.reply = this.reply.replace(/__UPDATE_SHOW_COLUMNS__/g, JSON.stringify(this.UPDATE_SHOW_COLUMNS,))

        this.reply = this.replace(this.reply);
        fs.writeFileSync(this.VUE_DATA_PATH, this.reply);
    }


    get VUE_DATA_PATH() {
        // 数据只计算一次, 可以缓存
        if (this.DataCache["VUE_DATA_PATH"]) return this.DataCache["VUE_DATA_PATH"];
        this.DataCache["VUE_DATA_PATH"] = path.join(this.TARGET_FRONTEND_DIR, this.VUE_DATA_FILE_NAME);
        return this.DataCache["VUE_DATA_PATH"] as string;
    }
}