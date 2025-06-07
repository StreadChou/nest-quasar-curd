<script setup lang="ts">
import {useQuasar} from "quasar";
import {computed, ref, watch} from "vue";
import {AttrType, AttrTypeArray} from "app/type/JsonFileDefine/Columns/AttrType/AttrType";
import {AttrConfig} from "app/type/JsonFileDefine/Attr";
import {
  AttrColumnDecoratorTypeArray,
  AttrRelationDecoratorTypeArray
} from "app/type/JsonFileDefine/Columns/ColumnsType";
import {ColumnType, ColumnTypeArr} from "app/type/JsonFileDefine/Columns/AttrType/AttrTypeColumn/ColumnType";

const $q = useQuasar();
const props = defineProps<{
  modelValue: AttrConfig
}>()

const emit = defineEmits(["update:modelValue"])
const model = ref<AttrConfig>(props.modelValue);
watch(model, () => {
  emit("update:modelValue", model.value)
}, {deep: true})


const attrDecoratorTypeOption = computed<AttrConfig["attrDecoratorType"][]>(() => {
  switch (model.value.attrTpe) {
    case AttrType.Column:
      return AttrColumnDecoratorTypeArray;
    case AttrType.Relation:
      return AttrRelationDecoratorTypeArray;
    default:
      return [];
  }
})

watch(() => model.value.attrTpe, (newVal, oldVal) => {
  // 如果字段类型改变, 需要更新选择项
  if (newVal != oldVal) {
    const options = attrDecoratorTypeOption;
    if (options.value && options.value[0]) {
      model.value.attrDecoratorType = options.value[0];
    }
  }
  model.value.columnOptions = model.value.columnOptions || {};

}, {deep: true, immediate: true})


const options = ref<ColumnType[]>([...ColumnTypeArr]);

const filterFn = (val: string, update: any, abort: any) => {
  update(() => {
    const needle = val.toLocaleLowerCase()
    options.value = ColumnTypeArr.filter(v => v.toLocaleLowerCase().indexOf(needle) > -1)
  })
}

</script>

<template>
  <div class="row q-gutter-x-md">
    <div class="col">
      <q-input v-model="model.name" standout dense label="名称"/>
    </div>
    <div class="col">
      <q-input v-model="model.mark" standout dense label="备注"/>
    </div>
  </div>

  <div class="row q-gutter-x-md">
    <div class="col">
      <q-select v-model="model.attrTpe" standout dense label="字段类型"
                :options="AttrTypeArray"
      >
      </q-select>
    </div>
    <div class="col">
      <q-select v-model="model.attrDecoratorType" standout dense label="装饰器类型"
                :options="attrDecoratorTypeOption"
      >
      </q-select>
    </div>
  </div>

  <template v-if="model.attrTpe == AttrType.Column && model.columnOptions">
    <q-select v-model="model.columnOptions.type" standout dense
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
  </template>

</template>

<style scoped>

</style>
