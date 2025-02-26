<script setup lang="ts">
import {TableColumnsExtension} from "app/src-ssr/types/Table";
import {onMounted, ref, watch} from "vue";
import {
  WhenColumnIsComplexTypeList,
} from "app/src-ssr/types/SimpleColumnType";

const props = defineProps<{
  title?: string,
  toEnv?: "frontend" | "backend"
  modelValue?: TableColumnsExtension
}>()
console.log(props)
const emit = defineEmits(["update:modelValue"])
const model = ref<TableColumnsExtension>(props.modelValue || {});

watch(model, () => {
  emit("update:modelValue", model.value)
}, {deep: true})


onMounted(() => {
  model.value = {};
  if (!("dbType" in model.value)) model.value.dbType = "json";
  if (!("type_string" in model.value)) model.value.type_string = "any";
  if (!("type_import" in model.value)) model.value.type_import = [];
})

</script>

<template>
  <div class="q-py-sm" style="border: dashed 1px gray">
    <div class="q-gutter-y-sm q-px-sm">
      <div class="q-pl-xs text-grey-9 q-mb-xs">{{ props.title ? props.title : 'JSON扩展编辑' }}</div>
      <q-select v-if='toEnv != "frontend"' v-model="model.dbType" :options="WhenColumnIsComplexTypeList"
                label="数据类型" dense standout
                clearable
      />
      <q-input v-model="model.type_string" clearable standout type="text" dense label="字段类型">
        <template #append>
          <q-btn label="使用any" no-caps flat dense @click="model.type_string = 'any'"></q-btn>
          <q-btn label="使用interface" no-caps flat dense @click="model.type_string = 'interface'"></q-btn>
        </template>
      </q-input>

      <template v-if="model.type_string == 'interface'">
        <q-input v-model="model.interface_string" clearable standout type="text" dense label="interface名字"/>
        <q-markup-table flat dense bordered separator="cell">
          <thead>
          <tr>
            <th colspan="2">导入类型</th>
          </tr>
          </thead>
          <tbody>
          <template v-for="item of model.type_import">
            <tr>
              <td>{{ item[0] }}</td>
              <td>{{ item[1] }}</td>
            </tr>
          </template>

          <tr>
            <td>TestInterface</td>
            <td>Table_UserIndex</td>
          </tr>
          <tr>
            <td>TestInterface</td>
            <td>Table_UserConstant</td>
          </tr>
          <tr>

          </tr>

          </tbody>

        </q-markup-table>
      </template>

    </div>
  </div>


</template>

<style scoped>

</style>
