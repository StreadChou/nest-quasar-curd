import {GenerateItem} from "../GenerateItem";
import * as fs from "fs";
import * as  path from "path";
import {AbstractGenerator} from "./AbstractGenerator";
import {ColumnsType, TypeExtensionForExtension} from "../../link/index";

export class GenerateInterface extends AbstractGenerator {
    reply!: string;

    constructor(item: GenerateItem) {
        super(item);
        this.reply = fs.readFileSync(path.join(__dirname, "../../../template/interface.temp")).toString();
    }

    start() {
        this.handleColumns()

        this.reply = this.replace(this.reply);
        fs.writeFileSync(this.INTERFACE_PATH, this.reply);
    }

    /** 处理字段 */
    handleColumns() {
        const List: string[] = [];
        for (const key in this.item.config.columns) {
            const data = this.item.config.columns[key];

            if (data.type == ColumnsType.Computed) continue;

            let string = "";
            // 处理备注
            if (data.label) string += `\t/** ${data.label} */\n`;
            // 处理备注
            if (data.mark) string += `\t/** ${data.mark} */\n`;


            if ([ColumnsType.Extension, ColumnsType.Relation, ColumnsType.Enum, ColumnsType.Customer].includes(data.type)) {
                const type_extension = data.type_extension as TypeExtensionForExtension;
                string += `\t${key}?: ${type_extension.type_string};\n`;

                const import_path = type_extension.import_path || [];
                for (const [_string, _path] of import_path){
                    this.addImport(_string, _path);
                }
            } else {
                string += `\t${key}?: ${data.type};\n`;
            }

            string = this.replaceColumns(string, data);
            List.push(string);
        }
        this.reply = this.reply.replace(/__INTERFACE_COLUMN__/g, List.join("\n"));
    }

    /** Entity 文件的路径 */
    get INTERFACE_PATH(): string {
        // 数据只计算一次, 可以缓存
        if (this.DataCache["ENTITY_PATH"]) return this.DataCache["ENTITY_PATH"];
        this.DataCache["ENTITY_PATH"] = path.join(this.TARGET_FRONTEND_DIR, this.INTERFACE_FILE_NAME);
        return this.DataCache["ENTITY_PATH"] as string;
    }


}