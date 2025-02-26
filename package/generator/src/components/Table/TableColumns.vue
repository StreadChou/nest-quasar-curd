<script setup lang="ts">
import TableDetail from "components/Table/TableDetail.vue";
import {useQuasar} from "quasar";
import {useTableStore} from "stores/table-store";
import EditColumnDialog from "components/Columns/EditColumnDialog.vue";
import {TableColumns} from "app/src-ssr/types/Table";
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

const showColumnPreview = (key: string, item: TableColumns) => {
  $q.dialog({
    component: ColumnShowDialog,
    componentProps: {
      columns_key: key,
      columns_form: item,
    }
  })
}

</script>

<template>
  <q-markup-table class="text-left" bordered separator="cell">
    <thead>
    <tr>
      <th>key</th>
      <th>名称</th>
      <th>类型</th>
      <th>操作</th>
    </tr>
    </thead>
    <tbody>
    <template v-for="(item, key) in tableStore.nowEditTableForm.columns"
              :key="`${ tableStore.nowEditTableForm.ClassName}_${key}`">
      <tr>
        <td>{{ key }}</td>
        <td>{{ item.name }}</td>
        <td></td>
        <td>
          <q-btn flat dense label="预览" @click="showColumnPreview(key, item)"></q-btn>
          <q-btn flat dense label="编辑" @click="openEditColumnDialog(key, item)"></q-btn>
        </td>
      </tr>
    </template>

    <tr>
      <td colspan="3">
        <q-btn class="full-width" flat color="primary" label="增加字段" @click="openEditColumnDialog()"/>
      </td>
    </tr>
    </tbody>

  </q-markup-table>
</template>

<style scoped>

</style>
