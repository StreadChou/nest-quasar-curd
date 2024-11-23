<script setup lang="ts">
import {computed, ref} from "vue";
import {ColumnsDefine, FormItemProps} from "../../../index";
import {AbstractTypeHandler} from "../AbstractTypeHandler";

const props = defineProps<FormItemProps>();
const handler = ref<AbstractTypeHandler>(props.handler);
const column = ref<ColumnsDefine>(handler.value.column)


const emits = defineEmits<{ (e: 'update:modelValue', value: string | number): void; }>();

const data = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
});

</script>

<template>
  没有对应的数据表编辑器: {{ columns_key }}
</template>

<style scoped>

</style>