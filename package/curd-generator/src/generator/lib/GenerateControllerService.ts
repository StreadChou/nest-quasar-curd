import {GenerateItem} from "../GenerateItem";
import * as fs from "fs";
import * as  path from "path";
import {AbstractGenerator} from "./AbstractGenerator";
import {GetFileBasenameNoExt} from "../../helper/PathHelper";

export class GenerateControllerService extends AbstractGenerator {
    reply!: string;

    constructor(item: GenerateItem) {
        super(item);
        this.reply = fs.readFileSync(path.join(__dirname, "../../../../template/controller-service.temp")).toString();
    }

    start() {
        this.addImport("__CLASS_NAME__CurdEntity", `./${GetFileBasenameNoExt(this.ENTITY_FILE_NAME)}`)

        this.reply = this.replace(this.reply);
        fs.writeFileSync(this.CONTROLLER_SERVICE_PATH, this.reply);
    }


    /** CONTROLLER 文件的名字 */
    get CONTROLLER_SERVICE_NAME(): string {
        // 数据只计算一次, 可以缓存
        if (this.DataCache["CONTROLLER_SERVICE_NAME"]) return this.DataCache["CONTROLLER_SERVICE_NAME"];
        let CONTROLLER_SERVICE_NAME = GetFileBasenameNoExt(this.item.output_backend_target)
        const Append = this.item.config.ControllerPathAppend || "controller-service";
        this.DataCache["CONTROLLER_SERVICE_NAME"] = `${CONTROLLER_SERVICE_NAME}.${Append}.ts`;
        return this.DataCache["CONTROLLER_SERVICE_NAME"] as string;
    }

    /** CONTROLLER 文件的路径 */
    get CONTROLLER_SERVICE_PATH(): string {
        // 数据只计算一次, 可以缓存
        if (this.DataCache["CONTROLLER_SERVICE_PATH"]) return this.DataCache["CONTROLLER_SERVICE_PATH"];
        this.DataCache["CONTROLLER_SERVICE_PATH"] = path.join(this.TARGET_BACKEND_DIR, this.CONTROLLER_SERVICE_NAME);
        return this.DataCache["CONTROLLER_SERVICE_PATH"] as string;
    }
}