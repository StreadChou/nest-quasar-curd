<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent full-width>
    <q-card class="full-width">
      <q-card-section>
        <div class="text-h6">增加Table</div>
      </q-card-section>

      <q-separator/>

      <q-form @submit="onOKClick">

        <q-card-section style="max-height: 50vh" class="scroll">

          <div class="q-gutter-y-sm">
            <q-input v-model="form.name" standout dense label="名称" :disable="true"/>
            <q-input v-model="form.mark" standout dense label="备注"/>
            <q-select v-model="form.columnsType" standout dense label="字段类型"
                      :options="ColumnsTypeOptionArr" emit-value map-options
            >
            </q-select>
            <q-checkbox v-model="form.useCustomerOption" label="使用自定义的option"/>
          </div>

          <div v-if="!form.useCustomerOption && form.columnsType">
            <div class="bg-white border-title-box">
              <div class="title">{{ ColumnsTypeOption[form?.columnsType]?.label }}数据定义</div>
              <div class="q-gutter-y-md" v-if="form.columnsType == ColumnsType.Column">
                <q-select v-model="form.column_Type" label="数据类型"
                          dense standout :options="SimpleColumnTypeOptionArr" emit-value map-options/>
              </div>
            </div>

            <div class="bg-white border-title-box">
              <div class="title">通用数据定义</div>
              <div class="q-gutter-y-md" v-if="form.columnCommonOptions">
                <q-input v-model="form.columnCommonOptions.name" label="字段名 (name)" dense standout/>

                <q-checkbox v-model="form.columnCommonOptions.select" label="是否参与查询 (select)"/>
                <q-checkbox v-model="form.columnCommonOptions.primary" label="是否为主键 (primary)"/>
                <q-select v-model="form.columnCommonOptions.generated" label="是否自动生成 (generated)"
                          dense standout :options="GeneratedColumnOptionArr" emit-value map-options/>

                <q-checkbox v-model="form.columnCommonOptions.unique" label="唯一约束 (unique)"/>
                <q-checkbox v-model="form.columnCommonOptions.nullable" label="可为空 (nullable)"/>
                <q-input v-model="form.columnCommonOptions.default" label="默认值 (default)" dense standout/>
                <q-input v-model="form.columnCommonOptions.onUpdate" label="更新时设置 (onUpdate)" dense standout/>
                <q-input v-model="form.columnCommonOptions.comment" label="注释 (comment)" dense standout/>
                <q-checkbox v-model="form.columnCommonOptions.array" label="是否数组 (array)"/>
                <q-input v-model="form.columnCommonOptions.transformer" label="Transformer" type="textarea" autogrow
                         dense standout/>
              </div>
            </div>


          </div>
          <div v-if="form.useCustomerOption">
            <q-input v-model="form.customerOption" standout type="textarea" autogrow label="自定义option"></q-input>
          </div>

        </q-card-section>

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

const $q = useQuasar();
const props = defineProps<{ data: ModelAttrItem }>()
defineEmits([
  ...useDialogPluginComponent.emits
])

const form = ref<ModelAttrItem>(JSON.parse(JSON.stringify(props.data)));
if (!("useCustomerOption" in form.value)) form.value.useCustomerOption = false;
if (!("columnCommonOptions" in form.value)) form.value.columnCommonOptions = {};


const commonOptions = form.value.columnCommonOptions;
// 设定默认值（TypeORM 有默认值的字段）
if (!("select" in commonOptions)) commonOptions.select = true;
if (!("primary" in commonOptions)) commonOptions.primary = false;
if (!("generated" in commonOptions)) commonOptions.generated = false;
if (!("unique" in commonOptions)) commonOptions.unique = false;
if (!("nullable" in commonOptions)) commonOptions.nullable = false;
if (!("array" in commonOptions)) commonOptions.array = false;

const {dialogRef, onDialogHide, onDialogOK} = useDialogPluginComponent()


const ColumnsTypeOptionArr = ref(Object.values(ColumnsTypeOption))
const SimpleColumnTypeOptionArr = ref([]);
const GeneratedColumnOptionArr = ref([
  {label: '关闭', value: false},
  {label: 'increment', value: 'increment'},
  {label: 'uuid', value: 'uuid'},
  {label: 'rowid', value: 'rowid'},
  {label: 'identity', value: 'identity'}
])


async function onOKClick() {
  onDialogOK(form.value)
}
</script>
