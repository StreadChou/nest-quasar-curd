import {defineStore, acceptHMRUpdate} from 'pinia';
import {Table, TableColumns} from "app/src-ssr/types/Table";
import {api} from "boot/axios";

export const useTableStore = defineStore('table', {
  state: () => ({
    moduleList: [] as Array<any>,
    tableList: [] as Array<Table>,

    nowEditTable: {} as Partial<Table>,
    nowEditTableForm: {} as Partial<Table>,
  }),

  getters: {
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
