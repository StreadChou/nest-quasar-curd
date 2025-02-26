<script setup lang="ts">
import {ColumnTypeOptions, TableColumnsExtension} from "app/src-ssr/types/Table";
import {onMounted, ref, watch} from "vue";
import {WhenColumnIsIntegerTypeList, WhenColumnIsStringTypeList} from "app/src-ssr/types/SimpleColumnType";

const props = defineProps<{
  modelValue?: TableColumnsExtension
}>()
const emit = defineEmits(["update:modelValue"])
const model = ref<TableColumnsExtension>(props.modelValue || {});


watch(model, () => {
  emit("update:modelValue", model.value)
}, {deep: true})


onMounted(() => {
  model.value = {};
})

</script>

<template>

</template>

<style scoped>

</style>
