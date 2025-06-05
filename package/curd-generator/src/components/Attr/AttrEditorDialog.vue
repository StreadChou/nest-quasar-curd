<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent full-width>
    <q-card class="full-width">
      <q-card-section>
        <div class="text-h6">增加Table</div>
      </q-card-section>

      <q-separator/>

      <q-form @submit="onOKClick">

        <q-card-section style="max-height: 50vh" class="scroll q-gutter-y-md">

          <div class="row q-gutter-x-md">
            <div class="col">
              <q-input v-model="form.name" standout dense label="名称"/>
            </div>
            <div class="col">
              <q-input v-model="form.mark" standout dense label="备注"/>
            </div>
          </div>

          <div class="row q-gutter-x-md">
            <div class="col">
              <q-select v-model="form.attrTpe" standout dense label="字段类型"
                        :options="AttrTypeArray"
              >
              </q-select>
            </div>
            <div class="col">
              <q-select v-model="form.attrDecoratorType" standout dense label="字段类型"
                        :options="attrDecoratorTypeOption"
              >
              </q-select>
            </div>
          </div>


          <div v-if="form.attrTpe == AttrType.Column">


            <div class="bg-white border-title-box">
              <div class="title">通用数据定义</div>
              <div class="q-gutter-y-md">
                <ColumnCommonOptions v-model="form.columnOptions"/>
              </div>
            </div>


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
import {computed, ref, watch} from "vue";
import {AttrConfig} from "app/type/JsonFileDefine/Attr";
import {AttrType, AttrTypeArray} from "app/type/JsonFileDefine/Columns/AttrType/AttrType";
import {
  AttrColumnDecoratorTypeArray,
  AttrRelationDecoratorTypeArray
} from "app/type/JsonFileDefine/Columns/ColumnsType";
import ColumnCommonOptions from "components/Attr/option/ColumnCommonOptions.vue";

const $q = useQuasar();
const props = defineProps<{ data: AttrConfig }>()
defineEmits([
  ...useDialogPluginComponent.emits
])

const form = ref<AttrConfig>(JSON.parse(JSON.stringify(props.data)));
if (!("columnOptions" in form.value)) form.value.columnOptions = {};

const {dialogRef, onDialogHide, onDialogOK} = useDialogPluginComponent()

watch(() => form.value.attrTpe, (newVal, oldVal) => {
  // 如果字段类型改变, 需要更新选择项
  if (newVal != oldVal) {
    const options = attrDecoratorTypeOption;
    if (options.value && options.value[0]) {
      form.value.attrDecoratorType = options.value[0];
    }
  }
  if (newVal != AttrType.Column) {
    form.value.columnOptions = {};
  }


}, {deep: true})

const attrDecoratorTypeOption = computed<AttrConfig["attrDecoratorType"][]>(() => {
  switch (form.value.attrTpe) {
    case AttrType.Column:
      return AttrColumnDecoratorTypeArray;
    case AttrType.Relation:
      return AttrRelationDecoratorTypeArray;
    default:
      return [];
  }
})


async function onOKClick() {
  onDialogOK(form.value)
}
</script>
