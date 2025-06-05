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


const GeneratedColumnOptionArr = ref([
  {label: "True", value: true},
  {label: "False", value: false},
  {label: "increment", value: "increment"},
  {label: "uuid", value: "uuid"},
  {label: "rowid", value: "rowid"},
  {label: "identity", value: "identity"},
])


</script>

<template>
  <div class="q-gutter-y-sm">
    <q-checkbox v-model="model.update" label="是否参与更新 (update/readonly)"/>
    <q-checkbox v-model="model.insert" label="是否参与插入 (insert)"/>
  </div>
</template>

<style scoped>

</style>
