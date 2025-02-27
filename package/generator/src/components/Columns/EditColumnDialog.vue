<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card style="min-width: 80vw;">
      <q-card-section>
        <div class="text-h6">为{{ tableStore.nowEditTableForm.Name }}增加字段</div>
      </q-card-section>

      <q-separator/>

      <q-form @submit="onOKClick">

        <q-card-section style="max-height: 50vh" class="scroll">

          <div class="q-gutter-y-sm">
            <div class="row q-col-gutter-x-md">
              <div class="col">
                <q-input v-model="key" standout dense label="字段KEY"/>
              </div>
              <div class="col">
                <q-input v-model="form.name" standout dense label="名称"/>
              </div>
            </div>
            <div class="row">
              <q-checkbox v-model="form.nullable" label="是否可选(非必填项)"/>
              <q-checkbox v-model="form.unique" label="不可重复"/>

              <template v-if="form.dataType == ColumnType.Json">
                <q-checkbox v-model="form.splitExtension" label="分离前后端扩展"/>
              </template>

            </div>


            <q-select v-model="form.dataType" :options="Object.values(ColumnTypeOptions)"
                      label="数据类型" dense standout
                      emit-value map-options clearable
            />

            <template v-if="form.dataType == ColumnType.IncrementId">
              <IncrementIdExtension v-model="form.extension as TableColumnsExtension"/>
            </template>
            <template v-if="form.dataType == ColumnType.Number">
              <NumberExtension v-model="form.extension as TableColumnsExtension"/>
            </template>
            <template v-if="form.dataType == ColumnType.Date">
              <DateExtension v-model="form.extension as TableColumnsExtension"/>
            </template>
            <template v-if="form.dataType == ColumnType.String">
              <StringExtension v-model="form.extension as TableColumnsExtension"/>
            </template>

            <template v-if="form.dataType == ColumnType.Json">
              <template v-if="form.splitExtension">
                <div class="row">
                  <div class="col">
                    <JsonExtension :title="'后端JSON扩展编辑'" :to-env="'backend'"
                                   v-model="form.extension_backend as TableColumnsExtension"/>
                  </div>
                  <div class="col">
                    <JsonExtension title="前端JSON扩展编辑" to-env="frontend"
                                   v-model="form.extension_frontend as TableColumnsExtension"/>
                  </div>
                </div>
              </template>
              <template v-else>
                <JsonExtension v-model="form.extension as TableColumnsExtension"/>
              </template>


            </template>

            <template v-if="form.dataType == ColumnType.RelationManyToMany">
              <template v-if="form.splitExtension">
                <div class="row">
                  <div class="col">
                    <RelationManyToManyExtension
                      :title="'后端多对多扩展编辑'"
                      :to-env="'backend'"
                      v-model="form.extension_backend as TableColumnsExtension"/>
                  </div>
                  <div class="col">
                    <RelationManyToManyExtension
                      title="前端多对多扩展编辑"
                      to-env="frontend"
                      v-model="form.extension_frontend as TableColumnsExtension"/>
                  </div>
                </div>
              </template>
              <template v-else>
                <RelationManyToManyExtension v-model="form.extension as TableColumnsExtension"/>
              </template>


            </template>

            <template
              v-if="[ColumnType.Boolean, ColumnType.CreatedTime, ColumnType.UpdatedTime].includes(form.dataType as ColumnType)">
              <DefaultExtension v-model="form.extension as TableColumnsExtension"/>
            </template>


          </div>
        </q-card-section>

        {{ form }}

        <q-separator/>

        <q-card-actions align="right">
          <q-btn flat label="关闭" color="dark" v-close-popup/>
          <q-btn flat label="保存" color="primary" type="submit"/>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import {useDialogPluginComponent, useQuasar} from 'quasar'
import {ref} from "vue";
import {ColumnType, ColumnTypeOptions, Table, TableColumns, TableColumnsExtension} from "app/src-ssr/types/Table";
import {useTableStore} from "stores/table-store";
import IncrementIdExtension from "components/Columns/DataTypeExtension/IncrementIdExtension.vue";
import NumberExtension from "components/Columns/DataTypeExtension/NumberExtension.vue";
import DateExtension from "components/Columns/DataTypeExtension/DateExtension.vue";
import StringExtension from "components/Columns/DataTypeExtension/StringExtension.vue";
import DefaultExtension from "components/Columns/DataTypeExtension/DefaultExtension.vue";
import JsonExtension from "components/Columns/DataTypeExtension/JsonExtension.vue";
import RelationManyToManyExtension from "components/Columns/DataTypeExtension/RelationManyToManyExtension.vue";


const $q = useQuasar();
defineEmits([
  ...useDialogPluginComponent.emits
])

const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()

const props = defineProps<{ columns_key?: string, columns_form?: TableColumns }>()

const key = ref(props.columns_key || "")
const form = ref<Partial<TableColumns>>(props.columns_form ? JSON.parse(JSON.stringify(props.columns_form)) : {});
// 增加默认值
if (!("nullable" in form.value)) form.value.nullable = false;
if (!("unique" in form.value)) form.value.unique = false;
if (!("splitExtension" in form.value)) form.value.splitExtension = false;


const tableStore = useTableStore();

const addNewColumns = () => {
  if (!tableStore.nowEditTableForm.columns) tableStore.nowEditTableForm.columns = {};
  tableStore.nowEditTableForm.columns[key.value as string] = form.value as TableColumns;
}

const editorColumns = () => {
  if (!tableStore.nowEditTableForm.columns) tableStore.nowEditTableForm.columns = {}

  // 如果是改变了key值, 则删除原先的key , 走增加逻辑
  if (props.columns_key && props.columns_key != key.value) {
    delete tableStore.nowEditTableForm.columns[props.columns_key]
    addNewColumns();
  } else {
    // 如果没有修改, 则直接走正常的逻辑
    tableStore.nowEditTableForm.columns[key.value] = form.value as TableColumns;
  }
}


async function onOKClick() {
  if (props.columns_key) editorColumns();
  else addNewColumns();

  if (tableStore.nowEditTable.columns) {
    tableStore.nowEditTable.columns = tableStore.nowEditTableForm.columns as Record<string, TableColumns>;
  }
  await tableStore.saveTableView();

  return onDialogOK()
}
</script>
