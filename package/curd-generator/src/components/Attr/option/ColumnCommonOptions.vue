<script setup lang="ts">
import {useQuasar} from "quasar";
import {ref, watch} from "vue";
import {ColumnCommonOptions} from "app/type/JsonFileDefine/Columns/AttrType/AttrTypeColumn/ColumnCommonOptions";

const $q = useQuasar();
const props = defineProps<{
  modelValue: ColumnCommonOptions | undefined
}>()

const emit = defineEmits(["update:modelValue"])
const model = ref<ColumnCommonOptions>(props.modelValue || {});
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
    <div class="row q-gutter-x-md">
      <div class="col">
        <q-input v-model="model.name" label="数据库存储字段名 (name)" dense standout/>
      </div>
      <div class="col">
        <q-select v-model="model.generated" label="是否自动生成 (generated)"
                  dense standout :options="GeneratedColumnOptionArr" emit-value map-options/>
      </div>
      <div class="col">
        <q-input v-model="model.comment" label="注释 (comment)" dense standout/>
      </div>
    </div>
    <div class="row">
      <q-checkbox v-model="model.select" label="是否参与查询 (select)"/>
      <q-checkbox v-model="model.primary" label="是否为主键 (primary)"/>
      <q-checkbox v-model="model.unique" label="唯一约束 (unique)"/>
      <q-checkbox v-model="model.nullable" label="可为空 (nullable)"/>
      <q-checkbox v-model="model.array" label="是否数组 (array)"/>
    </div>


    <q-input v-model="model.default" label="默认值 (default)" dense standout/>
    <q-input v-model="model.onUpdate" label="更新时设置 (onUpdate)" dense standout/>
    <q-input v-model="model.transformer" label="Transformer" type="textarea" autogrow
             dense standout/>
  </div>
</template>

<style scoped>

</style>
