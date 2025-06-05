<script setup lang="ts">
import {ref, watch} from "vue";
import {ColumnOptions} from "app/type/JsonFileDefine/Columns/AttrType/AttrTypeColumn/ColumnOptions";
import {
  ColumnType,
  ColumnTypeArr, ColumnTypeConfig,
  WithLengthColumnType, WithWidthColumnType
} from "app/type/JsonFileDefine/Columns/AttrType/AttrTypeColumn/ColumnType";

const props = defineProps<{
  modelValue: ColumnOptions | undefined
}>()

const emit = defineEmits(["update:modelValue"])
const model = ref<ColumnOptions>(props.modelValue || {});
watch(model, () => {
  emit("update:modelValue", model.value)
}, {deep: true})



watch(() => model.value.type, (newVal: ColumnType, oldVal: ColumnType) => {
  if (!ColumnTypeConfig[newVal as ColumnType]) return null;
  if (!ColumnTypeConfig[newVal as ColumnType].needImport) {
    model.value.typescriptType = undefined;
  } else {
    model.value.typescriptType = {
      type: "any",
      import: [],
    }
  }
}, {deep: true})

</script>

<template>








  <template v-if="model.typescriptType != undefined">
    <div>

    </div>
  </template>


  <div class="row">
    <div class="col">

    </div>
  </div>

</template>

<style scoped>

</style>
