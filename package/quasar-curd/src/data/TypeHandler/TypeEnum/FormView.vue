<script setup lang="ts">
import {computed, ref} from "vue";
import {ColumnsDefine, FormItemProps, TypeExtensionForEnum} from "../../../index";
import {AbstractTypeHandler} from "../AbstractTypeHandler";

const props = defineProps<FormItemProps>();
const handler = ref<AbstractTypeHandler>(props.handler);
const column = ref<ColumnsDefine>(handler.value.column)
const editor_bind = ref(Object.assign({
  standout: true,
  "emit-value": true,
  "map-options": true
}, handler.value.editor_bind(),))


const emits = defineEmits<{ (e: 'update:modelValue', value: string | number): void; }>();

const data = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
});

const typeExtension = <TypeExtensionForEnum>column.value.type_extension;
const options = ref(Object.values(typeExtension.option));

</script>

<template>
  <q-select v-model="data" :options="options"
            v-bind="editor_bind"
            :label="`${column.label}(${columns_key})`"
            :disable="handler.isDisable(create_or_update)"
  >

  </q-select>
</template>

<style scoped>

</style>