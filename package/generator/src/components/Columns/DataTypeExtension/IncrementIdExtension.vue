<script setup lang="ts">
import {TableColumnsExtension} from "app/src-ssr/types/Table";
import {ref, watch} from "vue";

const props = defineProps<{
  modelValue?: TableColumnsExtension
}>()
const emit = defineEmits(["update:modelValue"])
const model = ref<TableColumnsExtension>(props.modelValue || {});
if (!("uuid" in model.value)) model.value.uuid = false;

watch(model, () => {
  emit("update:modelValue", model.value)
}, {deep: true})

</script>

<template>
  <div class="q-py-sm" style="border: dashed 1px gray">
    <div class="q-gutter-y-sm q-px-sm">
      <div class="q-pl-xs text-grey-9 q-mb-xs">自增ID扩展编辑</div>
      <q-checkbox v-model="model.uuid" label="是否使用UDID"/>
    </div>
  </div>
</template>

<style scoped>

</style>
