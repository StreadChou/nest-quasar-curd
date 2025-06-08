<script lang="ts" setup>
import {useDialogPluginComponent, useQuasar} from 'quasar'
import {ref} from "vue";
import {AttrConfig} from "app/type/JsonFileDefine/Attr";
import {AttrType} from "app/type/JsonFileDefine/Columns/AttrType/AttrType";
import ColumnCommonOptions from "components/Attr/option/ColumnCommonOptions.vue";
import AttrBaseInfo from "components/Attr/AttrBaseInfo.vue";
import ColumnOptions from "components/Attr/option/ColumnOptions.vue";
import {
  ColumnType,
  ColumnTypeConfig,
  WithLengthColumnType,
  WithWidthColumnType
} from "app/type/JsonFileDefine/Columns/AttrType/AttrTypeColumn/ColumnType";
import WithLengthColumnOptions from "components/Attr/option/WithLengthColumnOptions.vue";
import WithWidthColumnOptions from "components/Attr/option/WithWidthColumnOptions.vue";
import ImportSetting from "components/ImportSetting/ImportSetting.vue";
import {AttrRelationDecoratorType} from "app/type/JsonFileDefine/Columns/ColumnsType";
import RelationOptionSetting from "components/Attr/option/RelationOptionSetting.vue";
import RelationSetting from "components/Attr/option/RelationSetting.vue";

const $q = useQuasar();
const props = defineProps<{
  data: AttrConfig,
  count: number,
}>()
defineEmits([
  ...useDialogPluginComponent.emits
])

const form = ref<AttrConfig>(JSON.parse(JSON.stringify(props.data)));

const {dialogRef, onDialogHide, onDialogOK} = useDialogPluginComponent()

async function onOKClick() {
  onDialogOK(form.value)
}

const tab = ref("BaseInfo");

</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent full-width>

    <q-card class="full-width">
      <q-card-section>
        <div class="text-h6">字段编辑</div>
      </q-card-section>

      <q-separator/>

      <q-form @submit="onOKClick">

        <q-card-section>
          <q-splitter :model-value="10" style="max-height: 50vh" class="scroll">

            <template v-slot:before>
              <q-tabs v-model="tab" vertical class="text-teal">
                <q-tab name="BaseInfo" label="基础信息"/>


                <template v-if="form.attrTpe == AttrType.Column">
                  <q-tab name="ColumnOptions" label="字段设置"/>
                  <q-tab name="CommonOptions" label="通用设置"/>

                  <template
                    v-if="form.columnOptions?.type && WithLengthColumnType.includes(form.columnOptions.type as string)">
                    <q-tab name="WithLengthColumnOptions" label="WithLength" no-caps/>
                  </template>

                  <template
                    v-if="form.columnOptions?.type && WithWidthColumnType.includes(form.columnOptions.type as string)">
                    <q-tab name="WithWidthColumnOptions" label="WithWidth" no-caps/>
                  </template>

                  <template
                    v-if="form.columnOptions?.type && ColumnTypeConfig[form.columnOptions.type as ColumnType].needImport">
                    <q-tab name="ImportSetting" label="类型导入设置" no-caps/>
                  </template>

                </template>

                <template v-if="form.attrTpe == AttrType.Relation">

                  <template v-if="form.attrDecoratorType == AttrRelationDecoratorType.OneToOne">

                  </template>

                  <template v-if="[
                      AttrRelationDecoratorType.OneToOne
                    ].includes(form.attrDecoratorType)">
                    <q-tab name="RelationSetting" label="关系设置" no-caps/>
                    <q-tab name="RelationOptionSetting" label="关系参数" no-caps/>
                  </template>

                </template>

              </q-tabs>
            </template>

            <template v-slot:after>
              <q-tab-panels v-model="tab" animated swipeable vertical transition-prev="jump-up"
                            transition-next="jump-up">

                <q-tab-panel name="BaseInfo" class="q-gutter-y-md">
                  <AttrBaseInfo v-model="form"/>
                </q-tab-panel>

                <q-tab-panel name="ColumnOptions">
                  <ColumnOptions v-model="form.columnOptions"/>
                </q-tab-panel>

                <q-tab-panel name="CommonOptions">
                  <ColumnCommonOptions v-model="form.columnOptions"/>
                </q-tab-panel>

                <q-tab-panel name="WithLengthColumnOptions">
                  <WithLengthColumnOptions v-model="form.columnOptions"/>
                </q-tab-panel>

                <q-tab-panel name="WithWidthColumnOptions">
                  <WithWidthColumnOptions v-model="form.columnOptions"/>
                </q-tab-panel>

                <q-tab-panel name="ImportSetting">
                  <ImportSetting :count="count" v-model="form.columnOptions.typescriptType"/>
                </q-tab-panel>

                <q-tab-panel name="RelationSetting">
                  <RelationSetting :count="count" v-model="form"/>
                </q-tab-panel>

                <q-tab-panel name="RelationOptionSetting">
                  <RelationOptionSetting :count="count" v-model="form.relationOptions"/>
                </q-tab-panel>


              </q-tab-panels>
            </template>

          </q-splitter>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="关闭" color="dark" v-close-popup/>
          <q-btn flat label="保存" color="primary" type="submit"/>
        </q-card-actions>
      </q-form>
    </q-card>

  </q-dialog>
</template>
