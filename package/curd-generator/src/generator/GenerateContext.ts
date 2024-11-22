import * as fs from "node:fs";
import * as path from "node:path";
import {GenerateItem} from "./GenerateItem";

export class GeneratorContext {
    path_to_instance: Record<string, GenerateItem> = {};

    constructor
    (
        public readonly config_root: string,
        public readonly input_root: string,
        public readonly output_backend_root: string,
        public readonly output_frontend_root: string,
    ) {
    }

    /** 开始执行 */
    start() {
        // 先移除已经生成好的文件 */
        if (fs.existsSync(this.output_backend_root)) {
            fs.rmSync(this.output_backend_root, {recursive: true})
        }
        // 先移除已经生成好的文件 */
        if (fs.existsSync(this.output_frontend_root)) {
            fs.rmSync(this.output_frontend_root, {recursive: true})
        }
        // 递归执行
        this.loop_run(this.input_root, this.output_backend_root, this.output_frontend_root);
    }

    /** 递归执行 */
    loop_run(input_root: string, output_backend_root: string, output_frontend_root: string) {
        // 读取文件夹下的所有文件;
        const files = fs.readdirSync(input_root);
        for (const file of files) {
            // 配置所在路径
            const input_target = path.join(input_root, file);
            // 服务器目标路径
            const output_backend_target = path.join(output_backend_root, file);
            // 客户端目标路径
            const output_frontend_target = path.join(output_frontend_root, file);

            // 如果是文件夹, 则开始递归执行
            if (fs.statSync(input_target).isDirectory()) {
                this.loop_run(input_target, output_backend_target, output_frontend_target);
                continue;
            }

            // 获取配置
            const content = require(input_target);

            // 如果没有对应的配置, 则代表是一个静态文件, 直接复制
            if (!("define" in content)) {
                if (!fs.existsSync(path.dirname(output_backend_target))) {
                    fs.mkdirSync(path.dirname(output_backend_target), {recursive: true})
                }
                fs.cpSync(input_target, output_backend_target)

                if (!fs.existsSync(path.dirname(output_frontend_root))) {
                    fs.mkdirSync(path.dirname(output_frontend_root), {recursive: true})
                }
                fs.cpSync(input_target, output_frontend_target)
                continue;
            }

            // 走生成逻辑
            const item = new GenerateItem(
                content["define"],
                output_backend_target,
                output_frontend_target,
            );
            this.path_to_instance[input_target] = item;
            item.start()
        }
    }
}