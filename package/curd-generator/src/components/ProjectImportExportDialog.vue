<script lang="ts" setup>
import {useDialogPluginComponent, useQuasar} from 'quasar'
import {ref} from "vue";
import {ColumnType, ColumnTypeArr,} from "app/type/JsonFileDefine/Columns/AttrType/AttrTypeColumn/ColumnType";
import {useDataStore} from "stores/data-store";

const $q = useQuasar();
const dataStore = useDataStore();
const props = defineProps<{ count: number, }>()
defineEmits([
  ...useDialogPluginComponent.emits
])

const {dialogRef, onDialogHide, onDialogOK} = useDialogPluginComponent()




const rawOptions = dataStore.getJsonDataAsSelectOptions(props.count)

const options = ref<ColumnType[]>([...rawOptions]);

const filterFn = (val: string, update: any, abort: any) => {
  update(() => {
    const needle = val.toLocaleLowerCase()
    options.value = rawOptions.filter(v => v.label.toLocaleLowerCase().indexOf(needle) > -1)
  })
}

const select = ref();

async function onOKClick() {
  onDialogOK(select.value)
}


</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent full-width>

    <q-card class="full-width">
      <q-card-section>
        <div class="text-h6">增加Table</div>
      </q-card-section>

      <q-separator/>

      <q-form @submit="onOKClick">

        <q-card-section>
          <q-select v-model="select" standout dense
                    filled
                    use-input
                    hide-selected
                    fill-input
                    input-debounce="0"
                    :options="options"
                    @filter="filterFn"
                    clearable
                    label="请选择从哪里导入"
                    emit-value
                    map-options
          >
          </q-select>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="关闭" color="dark" v-close-popup/>
          <q-btn flat label="保存" color="primary" type="submit"/>
        </q-card-actions>
      </q-form>
    </q-card>

  </q-dialog>
</template>
