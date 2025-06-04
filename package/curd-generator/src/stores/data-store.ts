import {defineStore, acceptHMRUpdate} from 'pinia';
import {InvokeProxy} from "src/library/InvokeProxy";
import {JsonFile} from "app/type/JsonFileDefine/Index";
import {useHistoryStore} from "stores/history-store";
import {ProjectHistoryItem} from "app/type/Project";
import {InvokeErrorHandler, ShowMessage} from "src/helper/ErrorHelper";
import type {QTreeNode} from "quasar";
import {ModuleConfig} from "app/type/JsonFileDefine/Module";
import {ModelConfig} from "app/type/JsonFileDefine/Model";
import {useViewStore} from "stores/view-store";
import ProjectEditor from "components/ProjectEditor.vue";
import {ProjectConfig} from "app/type/JsonFileDefine/Project";
import ModuleEditor from "components/ModuleEditor.vue";
import ModelEditor from "components/ModelEditor.vue";

export interface ProjectRecord {
  json_data: JsonFile,
  file_path: string,
  count: number
}

export const useDataStore = defineStore('data', {
  state: () => ({
    /** 左侧 菜单栏 是否展开 */
    leftDrawerOpen: false,
    /** 左侧的树状图 */
    treeNodes: [] as Array<QTreeNode & { viewId: string }>,
    /** 左侧选择 */
    treeSelected: "",

    /** 打开项目的计数器: 避免项目名字不唯一导致的问题 */
    counter: 0,
    /** project记录 */
    projectRecord: {} as Record<number, ProjectRecord>
  }),

  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    getCounter() {
      this.counter += 1;
      return this.counter;
    },

    /** 打开一个项目 */
    async openProject(file_path: string) {
      const odd = Object.values(this.projectRecord).find(ele => ele.file_path == file_path);
      if (odd) throw new Error("项目已经打开");

      const reply = await InvokeProxy("FileHandler.loadJsonFile", file_path)
      if (reply.code != 0) return InvokeErrorHandler(reply);
      const json_data: JsonFile = reply.data;

      await this.projectToHistory(json_data, file_path);

      const count = this.getCounter();
      this.projectRecord[count] = {json_data, file_path, count};
      const tree = this.projectToTreeNode(json_data, count);
      console.log(JSON.stringify(tree));
      this.treeNodes.push(tree);
    },

    /** 将项目记录到历史中 */
    async projectToHistory(data: JsonFile, file_path: string) {
      const item: ProjectHistoryItem = {
        project: data.project.name as string,
        file_path: file_path,
        modules_number: Object.values(data.modules).length,
        models_number: Object.values(data.modules).reduce((acc, module) => acc + Object.values(module.models).length, 0),
        created_at: data.project.created_at as number,
        updated_at: data.project.created_at as number,
      }
      const historyStore = useHistoryStore();
      await historyStore.pushOrUpdate(item);
    },

    async updateProject(count: number, data: Partial<ProjectConfig>) {
      const json_data = this.getJsonData(count);
      Object.assign(json_data.project, data);

      if ("name" in data) {
        const node = this.treeNodes.find(ele => ele.body == count.toString());
        console.log(node);
        if (node) node.label = data.name as string;
      }

      await this.saveData(count);
    },

    async updateModule(count: number, data: Partial<ModuleConfig>) {
      const json_data = this.getJsonData(count);
      const origin = json_data.modules[data.name as string];
      if (!origin) throw new Error("module 不存在");
      Object.assign(origin, data);
      await this.saveData(count);
    },

    async updateModel(count: number, module_name: string, model: Partial<ModelConfig>) {
      const module_data = this.getModule(count, module_name);
      const origin = module_data.models[model.name as string];
      if (!origin) throw new Error("model 不存在");
      Object.assign(origin, model);
      await this.saveData(count);
    },


    /** 创建model */
    async createModule(count: number, name: string) {
      const json_data = this.getJsonData(count);
      if (name in json_data.modules) throw new Error("modules 已经存在");

      const module: ModuleConfig = {
        name: name,
        isExport: true,
        toList: true,
        isGlobal: false,
        models: {}
      }
      json_data.modules[module.name] = module;
      json_data.project.updated_at = Date.now();

      const projectNode = this.treeNodes.find(ele => ele.body == count.toString());
      if (projectNode) {
        projectNode.children = projectNode.children || [];
        const tree = this.moduleToTreeNode(count, json_data, module);
        projectNode.children.push(tree);
      }

      await this.saveData(count);
    },

    async createModel(count: number, module_name: string, name: string) {
      const json_data = this.getJsonData(count);
      const module_data = this.getModule(count, module_name);
      module_data.models = module_data.models || {};

      const item: ModelConfig = {
        name: name,
        dbName: name,
        joinModuleImports: true,
        exportController: false,
        exportService: false,
        attrs: {},
      }
      module_data.models[item.name] = item;
      json_data.project.updated_at = Date.now();
      const projectNode = this.treeNodes.find(ele => ele.body == count.toString());
      if (projectNode) {
        projectNode.children = projectNode.children || [];
        const moduleNode = projectNode.children.find(ele => ele.label == module_name)
        if (moduleNode) {
          moduleNode.children = moduleNode.children || [];
          const tree = this.modelToTreeNode(count, json_data, module_data, item);
          moduleNode.children.push(tree);
        }
      }

      await this.saveData(count);
    },


    async saveData(count: number) {
      const projectRecord = this.getProjectRecord(count);

      const data_string = JSON.stringify(projectRecord.json_data, null, 2)
      const res = await InvokeProxy("FileHandler.saveJsonFile", projectRecord.file_path, data_string)
      console.log(res);
    },


    /** 获取缓存的项目信息 */
    getProjectRecord(count: number): ProjectRecord {
      if (!this.projectRecord[count]) throw new Error("项目不存在");
      return this.projectRecord[count];
    },

    /** 获取JSON数据 */
    getJsonData(count: number,) {
      const projectRecord = this.getProjectRecord(count);
      return projectRecord.json_data
    },

    /** 获取 module  */
    getModule(count: number, module_name: string): ModuleConfig {
      const json_data = this.getJsonData(count);
      if (!json_data.modules[module_name]) throw new Error(`module(${module_name}) 不存在`);
      return json_data.modules[module_name]
    },

    /** 点击到某个 项目 */
    selectProject(node: QTreeNode, data: JsonFile) {
      const viewStore = useViewStore();
      const count = parseInt(node.body as string);
      const viewId = `project_${count}:${data.project.name}`;
      viewStore.openOrChangePanel({
        name: `项目: ${data.project.name}`,
        id: viewId,
        view: ProjectEditor,
        props: {count, viewId},
      });
    },

    /** 点击到某个 Module */
    selectModule(node: QTreeNode, data: JsonFile, module: ModuleConfig) {
      const viewStore = useViewStore();
      const count = parseInt(node.body as string);
      const viewId = `project_${count}:${data.project.name}:${module.name}`;
      viewStore.openOrChangePanel({
        name: `${module.name}`,
        id: viewId,
        view: ModuleEditor,
        props: {count, viewId, module},
      });
    },

    /** 点击到某个 model */
    selectModel(node: QTreeNode, data: JsonFile, module: ModuleConfig, model: ModelConfig) {
      const viewStore = useViewStore();
      const count = parseInt(node.body as string);
      const viewId = `project_${count}:${data.project.name}:${module.name}:${model.name}`
      viewStore.openOrChangePanel({
        name: `${model.name}`,
        id: viewId,
        view: ModelEditor,
        props: {count, viewId, module, model},
      });
    },


    /** 将项目导入到左侧的树状图 */
    projectToTreeNode(data: JsonFile, count: number): QTreeNode & { viewId: string } {
      const viewId = `project_${count}:${data.project.name}`;
      return {
        label: data.project.name,
        viewId,
        handler: (node) => this.selectProject(node, data),
        body: count.toString(),
        children: Object.values(data.modules).map(module => this.moduleToTreeNode(count, data, module))
      }
    },

    /** 将 module 导入到左侧的树状图 */
    moduleToTreeNode(count: number, data: JsonFile, module: ModuleConfig): QTreeNode & { viewId: string } {
      const viewId = `project_${count}:${data.project.name}:${module.name}`;
      return {
        label: module.name,
        viewId,
        handler: (node) => this.selectModule(node, data, module),
        body: count.toString(),
        children: Object.values(module.models).map(model => this.modelToTreeNode(count, data, module, model))
      }
    },


    /** 将 model 导入到左侧的树状图 */
    modelToTreeNode(count: number, json_data: JsonFile, module: ModuleConfig, model: ModelConfig): QTreeNode & {
      viewId: string
    } {
      const viewId = `project_${count}:${json_data.project.name}:${module.name}:${model.name}`
      return {
        label: model.name,
        viewId,
        body: count.toString(),
        handler: (node) => this.selectModel(node, json_data, module, model),
      }
    },

    // async loadData() {
    //   const data = await InvokeProxy("FileHandler.loadJsonFile")
    //   this.initData(data)
    // },
    // async startExport() {
    //   const info = JSON.stringify({
    //     json_file_path: this.json_file_path,
    //     backend_path: this.backend_path,
    //     frontend_path: this.frontend_path,
    //   })
    //   const data = await InvokeProxy("FileHandler.startExport", info)
    // },
    // async saveData() {

    // },
    // initData(data: JsonFile) {
    //   this.data = undefined;
    //   this.breadcrumbs = []
    //   data.modules = data.modules || {};
    //   this.data = data;
    // },
    //
    // getModule(module_name: string): ModulesItem {
    //   this.data.modules = this.data.modules || {};
    //   if (module_name in this.data.modules) return this.data.modules[module_name] as ModulesItem;
    //   return {} as ModulesItem;
    // },
    //
    // getModel(module_name: string, model_name: string) {
    //   const module = this.getModule(module_name)
    //   if (!module.models) return {} as ModelsItem;
    //   if (model_name in module.models) return module.models[model_name] as ModelsItem;
    //   return {} as ModelsItem;
    // },
    //
    // setModule(module: ModulesItem) {
    //   this.data.modules = this.data.modules || {};
    //   this.data.modules[module.name as string] = module;
    // },
    //
    // setModel(module_name: string, model: ModelsItem) {
    //   const module = this.getModule(module_name)
    //   module.models = module.models || {};
    //   module.models[model.name as string] = model;
    // },
    //
    // increment() {
    //   this.counter++;
    // },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot));
}
