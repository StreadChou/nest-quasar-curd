<script setup lang="ts">
import {ref, watch} from "vue";
import {ImportDataConfig} from "app/type/TypescriptImport/ImportType";

const props = defineProps<{
  modelValue: ImportDataConfig | undefined
}>()

const emit = defineEmits(["update:modelValue"])
const model = ref<ImportDataConfig>(props.modelValue || {type: "any", imports: []});
watch(model, () => {
  emit("update:modelValue", model.value)
}, {deep: true})


</script>

<template>
  <q-markup-table flat bordered>
    <tbody>
    <tr>
      <td colspan="5">
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
        <q-btn flat dense label="从项目中导入"></q-btn>
        <q-btn flat dense label="从文件中导入"></q-btn>
      </td>
    </tr>
    </tbody>
  </q-markup-table>
</template>

<style scoped>

</style>
