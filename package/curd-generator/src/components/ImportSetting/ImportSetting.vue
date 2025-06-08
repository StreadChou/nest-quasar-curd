<script setup lang="ts">
import {ref, watch} from "vue";
import {ImportDataConfig, ImportDataIc} from "app/type/TypescriptImport/ImportType";
import {useQuasar} from "quasar";
import ProjectImportExportDialog from "components/ImportSetting/ProjectImportExportDialog.vue";
import FileImportExportDialog from "components/ImportSetting/FileImportExportDialog.vue";
import VMonacoEditor from "components/VMonacoEditor.vue";

const $q = useQuasar();
const props = defineProps<{
  count: number,
  modelValue: ImportDataConfig | undefined,
}>()

const emit = defineEmits(["update:modelValue"])
const model = ref<ImportDataConfig>(props.modelValue || {type: "any", imports: []});
watch(model, () => {
  emit("update:modelValue", model.value)
}, {deep: true})


const openProjectImport = () => {
  $q.dialog({
    component: ProjectImportExportDialog,
    componentProps: {count: props.count}
  }).onOk((data: ImportDataIc) => {
    model.value.imports.push(data);
  })
}

const openFileImport = () => {
  $q.dialog({
    component: FileImportExportDialog,
    componentProps: {count: props.count}
  }).onOk((data: ImportDataIc) => {
    if (data) model.value.imports.push(data);
  })
}

</script>

<template>
  <q-markup-table flat bordered separator="cell">
    <tbody>
    <tr>
      <td colspan="5" style="background: rgb(30,30,30)">
        <div class="text-white q-px-md">类型设置:</div>
        <VMonacoEditor
          v-model="model.type"
          language="typescript"
          height="200px"
        ></VMonacoEditor>
      </td>
    </tr>
    <tr>
      <td colspan="5" class="text-center">
        导入数据类型
      </td>
    </tr>
    <template v-for="item of model.imports">
      <tr>
        <td>{{ item.from }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.file }}</td>
        <td>{{ item.type }}</td>
        <td>
          <q-btn label="移除"></q-btn>
        </td>
      </tr>
    </template>
    <tr>
      <td colspan="5">
        <div class="row justify-center">
          <q-btn flat dense label="从项目中导入" @click="openProjectImport"></q-btn>
          <q-btn flat dense label="从文件中导入" @click="openFileImport"></q-btn>
        </div>
      </td>
    </tr>
    </tbody>
  </q-markup-table>
</template>

<style scoped>

</style>
