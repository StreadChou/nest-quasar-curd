<script setup lang="ts">
import {computed, ref} from "vue";
import {ColumnsDefine, FormItemProps} from "../../../index";
import {AbstractTypeHandler} from "../AbstractTypeHandler";
import moment from "moment";

const props = defineProps<FormItemProps>();
const handler = ref<AbstractTypeHandler>(props.handler);
const column = ref<ColumnsDefine>(handler.value.column)
const editor_bind = ref(Object.assign({
  standout: true,
  type: "datetime-local",
  step: "1"
}, handler.value.editor_bind(),))


const emits = defineEmits<{ (e: 'update:modelValue', value: string | number): void; }>();

const data = computed({
  get: () => {
    if (!props.modelValue) return "";
    return moment(props.modelValue).format("YYYY-MM-DD HH:mm:ss")
  },
  set: (value) => emits('update:modelValue', value),
});
</script>

<template>
  <q-input v-model="data"
           v-bind="editor_bind"
           :label="`${column.label}(${columns_key})`"
           :disable="handler.isDisable(create_or_update)"
  ></q-input>
</template>

<style scoped>

</style>