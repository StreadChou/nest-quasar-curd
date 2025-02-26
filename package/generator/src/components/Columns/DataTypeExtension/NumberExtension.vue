<script setup lang="ts">
import {ColumnTypeOptions, TableColumnsExtension} from "app/src-ssr/types/Table";
import {onMounted, ref, watch} from "vue";
import {WhenColumnIsIntegerTypeList} from "app/src-ssr/types/SimpleColumnType";

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
  <div class="q-py-sm" style="border: dashed 1px gray">
    <div class="q-gutter-y-sm q-px-sm">
      <div class="q-pl-xs text-grey-9 q-mb-xs">Number扩展编辑</div>
      <q-select v-model="model.dbType" :options="WhenColumnIsIntegerTypeList"
                label="数据类型" dense standout
                clearable
      />
      <q-input v-model.number="model.length" clearable standout type="number" dense label="长度"/>
      <q-input v-model.number="model.default" clearable standout type="number" dense label="默认值"/>
    </div>
  </div>


</template>

<style scoped>

</style>
