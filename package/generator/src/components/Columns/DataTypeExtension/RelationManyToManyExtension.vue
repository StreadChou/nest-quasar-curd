<script setup lang="ts">
import {TableColumnsExtension} from "app/src-ssr/types/Table";
import {onMounted, ref, watch} from "vue";
import {
  WhenColumnIsComplexTypeList,
} from "app/src-ssr/types/SimpleColumnType";

const props = defineProps<{
  title?: string,
  toEnv?: "frontend" | "backend"
  modelValue?: TableColumnsExtension
}>()
console.log(props)
const emit = defineEmits(["update:modelValue"])
const model = ref<TableColumnsExtension>(props.modelValue || {});

watch(model, () => {
  emit("update:modelValue", model.value)
}, {deep: true})


onMounted(() => {
  model.value = {};
  if (!("dbType" in model.value)) model.value.dbType = "json";
  if (!("type_string" in model.value)) model.value.type_string = "any";
  if (!("type_import" in model.value)) model.value.type_import = [];
})

</script>

<template>
  <div class="q-py-sm" style="border: dashed 1px gray">
    <div class="q-gutter-y-sm q-px-sm">
      <div class="q-pl-xs text-grey-9 q-mb-xs">{{ props.title ? props.title : '多对多扩展编辑' }}</div>


    </div>
  </div>


</template>

<style scoped>

</style>
