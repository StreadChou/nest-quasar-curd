<script setup lang="ts">
import {ref, watch} from "vue";
import {ImportDataConfig, ImportDataIc} from "app/type/TypescriptImport/ImportType";
import {useQuasar} from "quasar";
import ProjectImportExportDialog from "components/ImportSetting/ProjectImportExportDialog.vue";
import FileImportExportDialog from "components/ImportSetting/FileImportExportDialog.vue";

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
  <q-markup-table flat bordered>
    <tbody>
    <tr>
      <td colspan="5">
        {{ model }}
        <q-input v-model="model.type" label="字段 typescript 类型" dense standout/>
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
        <q-btn flat dense label="从项目中导入" @click="openProjectImport"></q-btn>
        <q-btn flat dense label="从文件中导入" @click="openFileImport"></q-btn>
      </td>
    </tr>
    </tbody>
  </q-markup-table>
</template>

<style scoped>

</style>
