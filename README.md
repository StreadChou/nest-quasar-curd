# NestQuasarCurd

快速构建Nest和Quasar的增删改查, 可以单独使用.

## 安装和使用

首先需要安装对应的依赖

* 后端项目(Nest项目)
    * 使用NPM ```` npm install @stread/nest-curd ````
    * 使用Yarn ```` yarn add @stread/nest-curd ````
* 前端项目(Quasar项目)
    * 使用NPM ```` npm install @stread/quasar-curd ````
    * 使用Yarn ```` yarn add @stread/quasar-curd ````

然后在项目中创建生成器的目录(当然也可以在frontend也可以在backend, 为了职责单一, 建议新建文件夹, 类似于 example)

#### 生成器项目构建流程

以下内容都可以参考 [example](example)/[nest-quasar-gen](example/nest-quasar-gen)

1. 创建文件夹 ```` mkdir nest-quasar-gen && cd nest-quasar-gen ````
2. 初始化 ```` yarn init ```` 然后按照步骤创建package.json
3. 安装必要依赖
    * 基础包: ```` yarn add @stread/curd-generator ````
    * Node支持: ```` yarn add -D @types/node ````
    * Ts支持 ```` yarn add -D typescript ````
    * TSNode(用于直接构建不编译): ```` yarn add -D ts-node ````
    * 数据库支持 ```` yarn add -D typeorm ````
4. 增加 scripts ````  "gen": "ts-node node_modules/@stread/curd-generator/src/generator.ts ./config.json" ````
5. 增加配置文件 ```` config.json ````, 包含以下字段:
    * 配置文件夹 ```` input ````
    * 输出的后台目录 ```` output_backend ````
    * 输出的前端目录 ```` output_frontend ````
6. 编辑配置文件
7. 执行 yarn run gen 来生成文件