<script setup lang="ts">
import TableDetail from "components/Table/TableDetail.vue";
import {useQuasar} from "quasar";
import {useTableStore} from "stores/table-store";
import EditColumnDialog from "components/Columns/EditColumnDialog.vue";
import {
  ColumnTypeOptions,
  defaultCreatedColumns,
  defaultIdColumn,
  defaultUpdatedColumns,
  TableColumns
} from "app/src-ssr/types/Table";
import ColumnShowDialog from "components/Columns/ColumnShowDialog.vue";


const $q = useQuasar();
const tableStore = useTableStore();

const openEditColumnDialog = (key?: string, item?: TableColumns) => {
  $q.dialog({
    component: EditColumnDialog,
    componentProps: {
      columns_key: key,
      columns_form: item,
    }
  })
}

const addIdColumn = () => {
  tableStore.nowEditTableForm.columns = tableStore.nowEditTableForm.columns || {};
  if ("id" in tableStore.nowEditTableForm.columns) {
    return $q.notify({message: "ID字段已经存在"})
  }
  tableStore.nowEditTableForm.columns["id"] = defaultIdColumn;
  tableStore.updateColumns()
}

const addCreatedColumn = () => {
  tableStore.nowEditTableForm.columns = tableStore.nowEditTableForm.columns || {};
  if ("created_at" in tableStore.nowEditTableForm.columns) {
    return $q.notify({message: "创建时间字段已经存在"})
  }
  tableStore.nowEditTableForm.columns["created_at"] = defaultCreatedColumns;
  tableStore.updateColumns()
}


const addUpdatedColumn = () => {
  tableStore.nowEditTableForm.columns = tableStore.nowEditTableForm.columns || {};
  if ("updated_at" in tableStore.nowEditTableForm.columns) {
    return $q.notify({message: "更新时间字段已经存在"})
  }
  tableStore.nowEditTableForm.columns["updated_at"] = defaultUpdatedColumns;
  tableStore.updateColumns()
}

/** 将元素上移 */
const upColumns = (key: string) => {
  const sortData = tableStore.nowEditTableFormKeys;
  const index = sortData.findIndex(ele => ele.key == key)
  if (index === 0) return $q.notify({message: "已经是第一个了"})
  // 和元素进行交换
  const self = sortData[index]?.value as TableColumns;
  const selfSort = self.sort as number;
  const target = sortData[index - 1]?.value as TableColumns;
  self.sort = target.sort as number;
  target.sort = selfSort;
  tableStore.updateColumns()
}

/** 将元素下移 */
const downColumns = (key: string) => {
  const sortData = tableStore.nowEditTableFormKeys;
  const index = sortData.findIndex(ele => ele.key == key)
  if (index === sortData.length - 1) return $q.notify({message: "已经是最后一个了"})
  // 和元素进行交换
  const self = sortData[index]?.value as TableColumns;
  const selfSort = self.sort as number;
  const target = sortData[index + 1]?.value as TableColumns;
  self.sort = target.sort as number;
  target.sort = selfSort;
  tableStore.updateColumns()
}


</script>

<template>
  <q-markup-table class="text-left" bordered separator="cell">
    <thead>
    <tr>
      <th>key</th>
      <th>名称</th>
      <th>类型</th>
      <th>非必填</th>
      <th>不重复</th>
      <th>操作</th>
    </tr>
    </thead>
    <tbody>

    <template
      v-for="item in tableStore.nowEditTableFormKeys"
      :key="`${ tableStore.nowEditTableForm.ClassName}_${item.key}`"
    >
      <tr>
        <td>{{ item.key }}</td>
        <td>{{ item.value.name }}</td>
        <td>
          {{ ColumnTypeOptions[item.value.dataType].label }}
        </td>
        <td>{{ item.value.nullable }}</td>
        <td>{{ item.value.unique }}</td>
        <td>
          <q-btn flat dense icon="expand_less" @click="upColumns(item.key)"/>
          <q-btn flat dense icon="expand_more" @click="downColumns(item.key)"/>
          <q-btn flat dense label="编辑" @click="openEditColumnDialog(item.key, item.value)"></q-btn>
        </td>
      </tr>
    </template>

    <tr>
      <td colspan="6">
        <div class="row justify-end q-gutter-x-lg">
          <div>
            <q-btn flat dense label="增加ID" @click="addIdColumn"/>
            <q-btn flat dense label="增加创建时间" @click="addCreatedColumn"/>
            <q-btn flat dense label="增加更新时间" @click="addUpdatedColumn"/>
          </div>
          <q-btn flat color="primary" label="增加字段" @click="openEditColumnDialog()"/>
        </div>
      </td>
    </tr>
    </tbody>

  </q-markup-table>
</template>

<style scoped>

</style>
