<script setup lang="ts">
import {computed, ref} from "vue";
import {FormItemProps, TypeExtensionForEnum} from "../../../index";
import {AbstractTypeHandler} from "../AbstractTypeHandler";

const props = defineProps<FormItemProps>();
const handler = ref<AbstractTypeHandler>(props.handler);
const column = ref<ColumnsDefineInFrontend>(handler.value.column)


const emits = defineEmits<{ (e: 'update:modelValue', value: string | number): void; }>();

const data = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
});

const typeExtension = <TypeExtensionForEnum>column.value.type_extension;
const options = ref(Object.values(typeExtension.option));

</script>

<template>
  <q-select v-model="data" :options="options" emit-value map-options clearable
            standout :label="`${column.label}(${column.key})`"
            :disable="handler.isDisable(create_or_update)"
  >

  </q-select>
</template>

<style scoped>

</style>