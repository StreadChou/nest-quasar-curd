<script setup lang="ts">
import {ref, watch} from "vue";
import {ModelConfig} from "app/type/JsonFileDefine/Model";

const props = defineProps<{
  modelValue: ModelConfig
}>()

const emit = defineEmits(["update:modelValue"])
const model = ref<ModelConfig>(props.modelValue);
watch(model, () => {
  emit("update:modelValue", model.value)
}, {deep: true})
</script>

<template>
  <div class="q-gutter-y-md">
    <div>
      <q-input standout dense v-model="model.name" label="名称" :disable="true"></q-input>
    </div>

    <div>
      <q-input standout v-model="model.dbName" label="数据名字"/>
    </div>

    <div class="bg-grey-2 q-py-sm">
      <q-checkbox v-model="model.exportController" label="是否导出controller"></q-checkbox>
      <q-checkbox v-model="model.exportService" label="是否导出service"></q-checkbox>
      <q-checkbox v-model="model.exportInterface" label="是否导出Interface"></q-checkbox>
    </div>
  </div>

</template>

<style scoped>

</style>
