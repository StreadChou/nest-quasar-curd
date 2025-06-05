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
  <div class="q-gutter-y-sm">
    <q-input v-model="model.length" label="数据长度 (length)" dense standout/>
  </div>
</template>

<style scoped>

</style>
