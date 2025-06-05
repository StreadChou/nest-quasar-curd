<script setup lang="ts">
import {ref, watch} from "vue";
import {ColumnOptions} from "app/type/JsonFileDefine/Columns/AttrType/AttrTypeColumn/ColumnOptions";
import {
  ColumnType,
  ColumnTypeArr,
  ColumnTypeConfig, WithLengthColumnType, WithWidthColumnType
} from "app/type/JsonFileDefine/Columns/AttrType/AttrTypeColumn/ColumnType";

const props = defineProps<{
  modelValue: ColumnOptions | undefined
}>()

const emit = defineEmits(["update:modelValue"])
const model = ref<ColumnOptions>(props.modelValue || {});
watch(model, () => {
  emit("update:modelValue", model.value)
}, {deep: true})

const options = ref<ColumnType[]>([...ColumnTypeArr]);

const filterFn = (val: string, update: any, abort: any) => {
  update(() => {
    const needle = val.toLocaleLowerCase()
    options.value = ColumnTypeArr.filter(v => v.toLocaleLowerCase().indexOf(needle) > -1)
  })
}

</script>

<template>
  <q-select v-model="model.type" standout dense
            filled
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :options="options"
            @filter="filterFn"
            clearable
            label="数据类型"
  >
  </q-select>


  <template v-if="WithLengthColumnType.includes(model.type as string)">
    <q-input v-model="model.length" label="数据长度 (length)" dense standout/>
  </template>

  <template v-if="WithWidthColumnType.includes(model.type as string)">
    <div>
      <q-input v-model="model.width" label="数据宽度 (width)" dense standout/>
      <div class="row">
        <q-checkbox v-model="model.zerofill" label="填充0 (zerofill)"/>
        <q-checkbox v-model="model.unsigned" label="无符号 (unsigned)"/>
      </div>
    </div>
  </template>


  <div class="row">
    <div class="col">
      <q-checkbox v-model="model.update" label="是否参与更新 (update/readonly)"/>
      <q-checkbox v-model="model.insert" label="是否参与插入 (insert)"/>
    </div>
  </div>

</template>

<style scoped>

</style>
