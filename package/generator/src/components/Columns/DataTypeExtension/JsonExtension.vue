<script setup lang="ts">
import {ImportConfigInterface, TableColumnsExtension} from "app/src-ssr/types/Table";
import {onMounted, ref, watch} from "vue";
import {
  WhenColumnIsComplexTypeList,
} from "app/src-ssr/types/SimpleColumnType";
import {useQuasar} from "quasar";
import ImportEditorDialog from "components/Columns/ImportExtension/ImportEditorDialog.vue";

const $q = useQuasar();
const props = defineProps<{
  title?: string,
  toEnv?: "frontend" | "backend"
  modelValue?: TableColumnsExtension
}>()

const emit = defineEmits(["update:modelValue"])
const model = ref<TableColumnsExtension>(props.modelValue || {});

watch(model, () => {
  emit("update:modelValue", model.value)
}, {deep: true})


const openImportDialog = (item?: ImportConfigInterface) => {
  $q.dialog({
    component: ImportEditorDialog,
    componentProps: {item}
  }).onOk((data: ImportConfigInterface) => {
    if (item) return Object.assign(item, data)
    model.value.type_import = model.value.type_import || []
    model.value.type_import.push(data);
  })
}


onMounted(() => {
  model.value = model.value || {};
  if (!("dbType" in model.value)) model.value.dbType = "json";
  if (!("type_string" in model.value)) model.value.type_string = "any";
  if (!("need_import" in model.value)) model.value.need_import = false;
  if (!("type_import" in model.value)) model.value.type_import = [];
})

</script>

<template>
  <div class="q-py-sm" style="border: dashed 1px gray">
    <div class="q-gutter-y-sm q-px-sm">
      <div class="q-pl-xs text-grey-9 q-mb-xs">{{ props.title ? props.title : 'JSON扩展编辑' }}</div>
      <q-select v-if='toEnv != "frontend"' v-model="model.dbType" :options="WhenColumnIsComplexTypeList"
                label="数据类型" dense standout
                clearable
      />
      <q-input v-model="model.type_string" clearable standout type="text" dense label="字段类型">
        <template #append>
          <q-btn label="使用any" no-caps flat dense @click="model.type_string = 'any'"></q-btn>
        </template>
      </q-input>

      <div>
        <q-checkbox v-model="model.need_import" label="是否需要从外部导入"/>
      </div>


      <template v-if="model.need_import">
        <q-markup-table flat dense bordered separator="cell">
          <thead>
          <tr>
            <th>导入方式</th>
            <th>导入路径</th>
            <th>导入对象</th>
            <th>是否default</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <template v-for="item of model.type_import">
            <tr>
              <td>{{ item.type }}</td>
              <td>{{ item.from }}</td>
              <td>{{ item.value }}</td>
              <td>{{ item.default }}</td>
              <td>
                <q-btn flat color="primary" label="编辑" @click="openImportDialog(item)"/>
                <q-btn flat color="primary" label="删除" @click="openImportDialog(item)"/>
              </td>
            </tr>
          </template>

          <tr>
            <td colspan="4">
              <q-btn flat dense class="full-width" label="添加" @click="openImportDialog()"/>
            </td>
          </tr>


          </tbody>

        </q-markup-table>
      </template>

    </div>
  </div>


</template>

<style scoped>

</style>
