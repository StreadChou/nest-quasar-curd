import {GenerateItem} from "../GenerateItem";
import * as fs from "fs";
import * as  path from "path";
import {GetFileBasenameNoExt, toCamelCase} from "../../helper/PathHelper";
import {ColumnsDefine} from "../../constant";

export class AbstractGenerator {
    protected DataCache: Record<string, any> = {};
    importList: Array<{ item: Set<string>, from: string }> = [];

    constructor(protected readonly item: GenerateItem,) {

    }

    /** Entity 文件的名字 */
    get ENTITY_FILE_NAME(): string {
        // 数据只计算一次, 可以缓存
        if (this.DataCache["ENTITY_FILE_NAME"]) return this.DataCache["ENTITY_FILE_NAME"];
        let ENTITY_FILE_NAME = GetFileBasenameNoExt(this.item.output_backend_target)
        const Append = this.item.config.EntityPathAppend || "entity";
        this.DataCache["ENTITY_FILE_NAME"] = `${ENTITY_FILE_NAME}.${Append}.ts`;
        return this.DataCache["ENTITY_FILE_NAME"] as string;
    }

    /** INTERFACE 文件的名字 */
    get INTERFACE_FILE_NAME(): string {
        // 数据只计算一次, 可以缓存
        if (this.DataCache["ENTITY_FILE_NAME"]) return this.DataCache["ENTITY_FILE_NAME"];
        let ENTITY_FILE_NAME = GetFileBasenameNoExt(this.item.output_backend_target)
        const Append = this.item.config.EntityPathAppend || "interface";
        this.DataCache["ENTITY_FILE_NAME"] = `${ENTITY_FILE_NAME}.${Append}.ts`;
        return this.DataCache["ENTITY_FILE_NAME"] as string;
    }

    /** 前端数据的 文件名字 */
    get VUE_DATA_FILE_NAME() {
        // 数据只计算一次, 可以缓存
        if (this.DataCache["VUE_DATA_FILE_NAME"]) return this.DataCache["VUE_DATA_FILE_NAME"];
        let VUE_DATA_FILE_NAME = GetFileBasenameNoExt(this.item.output_backend_target)
        const Append = this.item.config.EntityPathAppend || "view.data";
        this.DataCache["VUE_DATA_FILE_NAME"] = `${toCamelCase(`${VUE_DATA_FILE_NAME}.${Append}`)}.ts`;
        return this.DataCache["VUE_DATA_FILE_NAME"] as string;
    }

    /** 后端文件夹路径 */
    get TARGET_BACKEND_DIR(): string {
        // 数据只计算一次, 可以缓存
        if (this.DataCache["TARGET_BACKEND_DIR"]) return this.DataCache["TARGET_BACKEND_DIR"];
        const TARGET_BACKEND_DIR = path.dirname(this.item.output_backend_target);
        if (!fs.existsSync(TARGET_BACKEND_DIR)) fs.mkdirSync(TARGET_BACKEND_DIR, {recursive: true});
        this.DataCache["TARGET_BACKEND_DIR"] = TARGET_BACKEND_DIR;
        return this.DataCache["TARGET_BACKEND_DIR"] as string;
    }

    /** 前端文件夹路径 */
    get TARGET_FRONTEND_DIR(): string {
        // 数据只计算一次, 可以缓存
        if (this.DataCache["TARGET_FRONTEND_DIR"]) return this.DataCache["TARGET_FRONTEND_DIR"];
        const TARGET_FRONTEND_DIR = path.dirname(this.item.output_frontend_target);
        if (!fs.existsSync(TARGET_FRONTEND_DIR)) fs.mkdirSync(TARGET_FRONTEND_DIR, {recursive: true});
        this.DataCache["TARGET_FRONTEND_DIR"] = TARGET_FRONTEND_DIR;
        return this.DataCache["TARGET_FRONTEND_DIR"] as string;
    }


    start() {

    }


    /** 备注 */
    get TABLE_MARK(): string {
        // 数据只计算一次, 可以缓存
        if (this.DataCache["TABLE_MARK"]) return this.DataCache["TABLE_MARK"];
        let TABLE_MARK = this.item.config.TableMark || this.item.config.ClassName;
        this.DataCache["TABLE_MARK"] = `/** ${TABLE_MARK} */`;
        return this.DataCache["TABLE_MARK"] as string;
    }


    replace(reply: string) {
        if (this.importList.length > 0) {
            const list: string[] = [];
            for (const im of this.importList) {
                list.push(`import {${Array.from(im.item).join(", ")}} from "${im.from}";`)
            }
            reply = reply.replace(/__IMPORT__/g, list.join("\n"));
        } else {
            reply = reply.replace(/__IMPORT__/g, "");
        }

        reply = reply.replace(/__TABLE_MARK__/g, this.TABLE_MARK);
        reply = reply.replace(/__CLASS_NAME__/g, this.item.config.ClassName);

        reply = reply.replace(/__RESTFUL__/g, this.item.config.Restful);

        return reply;
    }

    replaceColumns(string: string, col: ColumnsDefine) {

        if (col.label) string = string.replace(/__COLUMNS_LABEL__/g, col.label)
        if (col.mark) string = string.replace(/__COLUMNS_MARK__/g, col.mark)

        return string;
    }

    handleDecorator(data: string) {
        if (data.trim().startsWith("@Entity")) this.addImport("Entity", "typeorm")
        if (data.trim().startsWith("@PrimaryGeneratedColumn")) this.addImport("PrimaryGeneratedColumn", "typeorm")
        if (data.trim().startsWith("@Column")) this.addImport("Column", "typeorm")
        if (data.trim().startsWith("@CreateDateColumn")) this.addImport("CreateDateColumn", "typeorm")
        if (data.trim().startsWith("@UpdateDateColumn")) this.addImport("UpdateDateColumn", "typeorm")
        if (data.trim().startsWith("@VersionColumn")) this.addImport("VersionColumn", "typeorm")
        if (data.trim().startsWith("@DeleteDateColumn")) this.addImport("DeleteDateColumn", "typeorm")
        if (data.trim().startsWith("@PrimaryColumn")) this.addImport("PrimaryColumn", "typeorm")
        if (data.trim().startsWith("@ManyToMany")) this.addImport("ManyToMany", "typeorm")
        if (data.trim().startsWith("@ManyToOne")) this.addImport("ManyToOne", "typeorm")
        if (data.trim().startsWith("@OneToMany")) this.addImport("OneToMany", "typeorm")
        if (data.trim().startsWith("@OneToOne")) this.addImport("OneToOne", "typeorm")
        if (data.trim().startsWith("@JoinColumn")) this.addImport("JoinColumn", "typeorm")
        return data;
    }

    addImport(item: string | string[], from: string) {
        let ele = this.importList.find(ele => ele.from == from);
        if (!ele) {
            ele = {item: new Set(), from: from};
            this.importList.push(ele);
        }
        const items: string[] = typeof item === "string" ? [item] : item;
        items.forEach(e => ele?.item.add(e));
    }
}