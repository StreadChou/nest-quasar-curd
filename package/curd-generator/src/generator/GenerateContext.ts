import * as fs from "node:fs";
import * as path from "node:path";
import {GenerateItem} from "./GenerateItem";

export class GeneratorContext {
    constructor
    (
        public readonly config_root: string,
        public readonly input_root: string,
        public readonly output_backend_root: string,
        public readonly output_frontend_root: string,
    ) {
        console.log("程序即将开始")
    }

    start() {
        if (fs.existsSync(this.output_backend_root)) {
            fs.rmSync(this.output_backend_root, {recursive: true})
        }
        if (fs.existsSync(this.output_frontend_root)) {
            fs.rmSync(this.output_frontend_root, {recursive: true})
        }

        this.loop_run(this.input_root, this.output_backend_root, this.output_frontend_root);
    }

    loop_run(input_root: string, output_backend_root: string, output_frontend_root: string) {
        const files = fs.readdirSync(input_root);
        for (const file of files) {
            const input_target = path.join(input_root, file);
            const output_backend_target = path.join(output_backend_root, file);
            const output_frontend_target = path.join(output_frontend_root, file);

            if (fs.statSync(input_target).isDirectory()) {
                this.loop_run(input_target, output_backend_target, output_frontend_target);
                continue;
            }
            const content = require(input_target);
            if (!("define" in content)) {
                if (!fs.existsSync(path.dirname(output_backend_target))) {
                    fs.mkdirSync(path.dirname(output_backend_target), {recursive: true})
                }
                fs.cpSync(input_target, output_backend_target)
                console.log(input_target, output_backend_target)

                if (!fs.existsSync(path.dirname(output_frontend_root))) {
                    fs.mkdirSync(path.dirname(output_frontend_root), {recursive: true})
                }
                fs.cpSync(input_target, output_frontend_target)
                continue;
            }

            const item = new GenerateItem(
                content["define"],
                output_backend_target,
                output_frontend_target,
            );
            item.start()
        }
    }
}