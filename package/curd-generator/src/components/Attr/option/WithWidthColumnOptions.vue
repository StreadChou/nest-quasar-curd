<script setup lang="ts">
import {useQuasar} from "quasar";
import {ref, watch} from "vue";
import {ColumnOptions} from "app/type/JsonFileDefine/Columns/AttrType/AttrTypeColumn/ColumnOptions";

const $q = useQuasar();
const props = defineProps<{
  modelValue: ColumnOptions | undefined
}>()

const emit = defineEmits(["update:modelValue"])
const model = ref<ColumnOptions>(props.modelValue || {});
watch(model, () => {
  emit("update:modelValue", model.value)
}, {deep: true})


</script>

<template>
  <div>
    <q-input v-model="model.width" label="数据宽度 (width)" dense standout/>
    <div class="row">
      <q-checkbox v-model="model.zerofill" label="填充0 (zerofill)"/>
      <q-checkbox v-model="model.unsigned" label="无符号 (unsigned)"/>
    </div>
  </div>
</template>

<style scoped>

</style>
