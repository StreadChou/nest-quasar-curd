<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card style="min-width: 80vw;">
      <q-card-section>
        <div class="text-h6">导入设置</div>
      </q-card-section>

      <q-separator/>


      <q-card-section style="max-height: 50vh" class="scroll">
        <q-tabs
          v-model="model.type"
          dense
          class="bg-grey-2 text-grey-7"
          active-color="primary"
          indicator-color="purple"
          align="justify"
        >
          <q-tab name="generator" label="生成器内部"/>
          <q-tab name="url" label="指定链接"/>
          <q-tab name="customer" label="自定义"/>
        </q-tabs>

        <q-tab-panels v-model="model.type" animated>
          <q-tab-panel name="generator" class="q-gutter-y-md">
            <q-select v-model="model.from"
                      :options="tableStore.importOptions"
                      standout label="请选择表名"
                      emit-value map-options
            />

            <q-select v-model="model.value"
                      :options="tableStore.importOptions?.find(ele=>ele.value == model.from)?.child || []"
                      standout label="请选择表名"
                      emit-value map-options
            />

          </q-tab-panel>

          <q-tab-panel name="url" class="q-gutter-y-md">
            <q-input v-model="model.from" standout label="从什么链接导入"></q-input>
            <q-input v-model="model.value" standout label="导入什么"></q-input>
            <q-checkbox v-model="model.default" label="是否default"/>
          </q-tab-panel>

          <q-tab-panel name="customer" class="q-gutter-y-md">
            <q-input v-model="model.from" standout label="请输入导入文本"></q-input>
          </q-tab-panel>
        </q-tab-panels>


      </q-card-section>

      <q-separator/>

      <q-card-actions align="right">
        <q-btn flat label="保存" color="primary" @click="onOKClick"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import {useDialogPluginComponent, useQuasar} from 'quasar'
import {ref, watch} from "vue";
import {
  ColumnType,
  ColumnTypeOptions,
  ImportConfigInterface,
  Table,
  TableColumns,
  TableColumnsExtension
} from "app/src-ssr/types/Table";
import {useTableStore} from "stores/table-store";
import IncrementIdExtension from "components/Columns/DataTypeExtension/IncrementIdExtension.vue";
import NumberExtension from "components/Columns/DataTypeExtension/NumberExtension.vue";
import DateExtension from "components/Columns/DataTypeExtension/DateExtension.vue";
import StringExtension from "components/Columns/DataTypeExtension/StringExtension.vue";
import DefaultExtension from "components/Columns/DataTypeExtension/DefaultExtension.vue";
import JsonExtension from "components/Columns/DataTypeExtension/JsonExtension.vue";
import RelationManyToManyExtension from "components/Columns/DataTypeExtension/RelationManyToManyExtension.vue";


const $q = useQuasar();
const tableStore = useTableStore();

defineEmits([
  ...useDialogPluginComponent.emits
])
const props = defineProps<{ item?: ImportConfigInterface }>()

const model = ref<ImportConfigInterface>(props.item || {type: "generator", default: false, from: "", value: ""});
watch(model, (A, B) => {
  if (A.type != B.type) {
    model.value.default = false;
    model.value.from = "";
    model.value.value = "";
  }
}, {deep: true})


const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()


async function onOKClick() {
  return onDialogOK(model.value)
}
</script>
