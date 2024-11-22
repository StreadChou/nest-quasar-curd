import {GenerateItem} from "../GenerateItem";
import * as fs from "fs";
import * as  path from "path";
import {AbstractGenerator} from "./AbstractGenerator";
import {ColumnsType, TypeExtensionForExtension} from "../../link/index";


export class GenerateEntity extends AbstractGenerator {
    reply!: string;

    constructor(item: GenerateItem) {
        super(item);
        this.reply = fs.readFileSync(path.join(__dirname, "../../../template/class.temp")).toString();
    }

    start() {
        this.handleClassDecorator()
        this.handleColumns()

        this.reply = this.replace(this.reply);
        fs.writeFileSync(this.ENTITY_PATH, this.reply);
    }

    /** 处理字段 */
    handleColumns() {
        const List: string[] = [];
        for (const key in this.item.config.columns) {
            const data = this.item.config.columns[key]
            if (data.type == ColumnsType.Computed) continue;

            let string = "";

            // 处理备注
            if (data.label) {
                string += `\t/** ${data.label} */\n`;
            }

            // 处理备注
            if (data.mark) {
                string += `\t/** ${data.mark} */\n`;
            }


            // 如果有装饰器, 则先处理装饰器
            if (data.backend.decorator) {
                for (const decorator of data.backend.decorator) {
                    string += `\t${this.handleDecorator(decorator)}\n`;
                }
            }

            if ([ColumnsType.Extension, ColumnsType.Relation, ColumnsType.Enum, ColumnsType.Customer].includes(data.type)) {
                const type_extension = data.type_extension as TypeExtensionForExtension;
                string += `\t${key}: ${type_extension.type_string};\n`;

                const import_path = type_extension.import_path || [];
                for (const [_string, _path] of import_path){
                    this.addImport(_string, _path);
                }
            } else {
                string += `\t${key}: ${data.type};\n`;
            }

            string = this.replaceColumns(string, data);
            List.push(string);
        }
        this.reply = this.reply.replace(/__ClASS_COLUMN__/g, List.join("\n"));
    }

    /** 处理类的装饰器 */
    handleClassDecorator() {
        if (this.item.config.backend.EntityDecorator) {
            const DecoratorList: string[] = [];
            for (const data of this.item.config.backend.EntityDecorator) {
                DecoratorList.push(this.handleDecorator(data));
            }
            this.reply = this.reply.replace(/__CLASS_DECORATOR__/g, DecoratorList.join("/n"));
        }
    }

    /** Entity 文件的路径 */
    get ENTITY_PATH(): string {
        // 数据只计算一次, 可以缓存
        if (this.DataCache["ENTITY_PATH"]) return this.DataCache["ENTITY_PATH"];
        this.DataCache["ENTITY_PATH"] = path.join(this.TARGET_BACKEND_DIR, this.ENTITY_FILE_NAME);
        return this.DataCache["ENTITY_PATH"] as string;
    }


}