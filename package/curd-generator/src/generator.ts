import * as fs from 'fs';
import * as path from 'path';
import {GeneratorContext} from "./generator/GenerateContext";

// 获取脚本传入的参数
const args = process.argv.slice(2);

// 确保参数数量正确
if (args.length < 1) {
    console.error('请提供配置文件的路径作为第一个参数。');
    process.exit(1);
}

// 获取传入的文件路径
const configPath = args[0];

// 读取 JSON 文件
const data = fs.readFileSync(configPath, 'utf-8',).toString()
const config = JSON.parse(data);

// 获取当前工作目录
const currentDir = path.dirname(path.resolve(configPath));

const input = path.resolve(currentDir, config.input);
const output_backend = path.resolve(currentDir, config.output_backend);
const output_frontend = path.resolve(currentDir, config.output_frontend);

const generate = new GeneratorContext(configPath, input, output_backend, output_frontend);
generate.start();
