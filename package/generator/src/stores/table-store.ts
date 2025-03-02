import {defineStore, acceptHMRUpdate} from 'pinia';
import {Table, TableColumns} from "app/src-ssr/types/Table";
import {api} from "boot/axios";
import * as ts from 'typescript';


export const useTableStore = defineStore('table', {
  state: () => ({
    moduleList: [] as Array<any>,
    tableList: [] as Array<Table>,

    nowEditTable: {} as Partial<Table>,
    nowEditTableForm: {} as Partial<Table>,
  }),

  getters: {
    tableOptions(state) {
      let reply: Array<{ value: string, label: string }> = [];
      for (const table of state.tableList) {
        reply.push({value: table.ClassName, label: `${table.Name}#${table.ClassName}`, child: [table.ClassName]})
      }
      return reply;
    },
    importOptions(state) {
      let reply: Array<{ value: string, label: string, child: string[] }> = [];
      for (const table of state.tableList) {
        reply.push({value: table.ClassName, label: `${table.Name}#${table.ClassName}`, child: [table.ClassName]})
        const constants = table.Constants;
        if (!constants || !constants.trim()) continue;

        const child: string[] = [];
        const namedExportPattern = /export\s+(const|let|var|function|class|interface|type|enum|declare\s+(class|function|var|const|let))\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
        const defaultExportPattern = /export\s+default\s+([a-zA-Z_][a-zA-Z0-9_]*|\{([^}]+)\})/g;
        const namedExports = [];
        const defaultExports = [];
        let match;
        while ((match = namedExportPattern.exec(constants)) !== null) {
          child.push(match[3]);
        }

        while ((match = defaultExportPattern.exec(constants)) !== null) {
          child.push(match[1] || match[2].trim());
        }
        reply.push({value: `${table.ClassName}.Constants`, label: `${table.Name}#Constants`, child: child})
      }
      return reply;
    },
    nowEditTableFormKeys: (state) => {
      let temp: Array<{ key: string, value: TableColumns }> = [];
      const columns = state.nowEditTableForm?.columns || {};
      const keys = Object.keys(columns);
      for (let i in keys) {
        const index = parseInt(i);
        const key = keys[index] as string;

        const value = columns[key] as TableColumns
        if (!("sort" in value)) value.sort = index;
        temp.push({key, value: value});
      }
      temp.sort((A, B) => (A.value?.sort || 0) - (B.value?.sort || 0))

      return temp;

    },
  },

  actions: {
    changeEditTable(table: Partial<Table>) {
      this.nowEditTable = table;
      this.nowEditTableForm = JSON.parse(JSON.stringify(table));
    },


    loadServerData(body: { modules: any, tables: any }) {
      this.tableList = body.tables;
    },

    async getServerData() {
      const AxiosResponse = await api.post("_GET_JSON_FILE",)
      if (AxiosResponse.data.code != 0) {
        return null;
      }
      const {content} = AxiosResponse.data.data;

      this.loadServerData(content)
    },

    async saveTableView() {
      const AxiosResponse = await api.post("_UPDATE_JSON_FILE", {
        content: {
          modules: this.moduleList,
          tables: this.tableList,
        }
      })
      if (AxiosResponse.data.code == 0) return null;
    },

    async exportTableView() {
      const AxiosResponse = await api.post("_ExportTable", {
        content: {
          modules: this.moduleList,
          tables: this.tableList,
        }
      })
      if (AxiosResponse.data.code == 0) return null;
    },

    async saveNowEditor() {
      if (!this.nowEditTableForm || !this.nowEditTable) return null;
      Object.assign(this.nowEditTable, this.nowEditTableForm);
      return this.saveTableView();
    },

    async updateColumns() {
      if (!this.nowEditTableForm || !this.nowEditTableForm.columns) return null;
      if (!this.nowEditTable) return null;
      this.nowEditTable.columns = this.nowEditTableForm.columns;
      await this.saveTableView();
    }

  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTableStore, import.meta.hot));
}
