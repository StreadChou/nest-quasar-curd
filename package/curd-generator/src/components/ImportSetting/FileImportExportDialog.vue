<script lang="ts" setup>
import {useDialogPluginComponent, useQuasar} from 'quasar'
import {ref} from "vue";
import {ImportDataIc, ImportType} from "app/type/TypescriptImport/ImportType";
import DropSelectFile from "components/DropSelectFile.vue";
import {InvokeProxy} from "src/library/InvokeProxy";
import {InvokeErrorHandler} from "src/helper/ErrorHelper";
import {UserInputError} from "src/app/ErrorHandler/UserInputError";
import {useDataStore} from "stores/data-store";

const $q = useQuasar();
const props = defineProps<{ count: number }>()
const dataStore = useDataStore();

defineEmits([
  ...useDialogPluginComponent.emits
])

const {dialogRef, onDialogHide, onDialogOK} = useDialogPluginComponent()

const select = ref();

async function onOKClick() {
  onDialogOK(select.value)
}

const options = ref<{ value: ImportDataIc, label: string }[]>([]);

const selectFile = async (path: string) => {
  const reply = await InvokeProxy("AppHandler.analysisTsFileExport", path)
  if (reply.code != 0) return InvokeErrorHandler(reply);
  if (!reply.data.exports || reply.data.exports.length <= 0) {
    throw new UserInputError("此文件没有导出的信息, 请重新选择")
  }

  for (const item of reply.data.exports) {
    const importReply = await InvokeProxy("FileHandler.getImportPath", dataStore.getProjectRecord(props.count).file_path, path)
    if (reply.code != 0) return InvokeErrorHandler(reply);
    const file = importReply.data.importString;

    options.value.push({
      label: item.name,
      value: {
        /** 从哪里导入 */
        from: "file",
        /** 导入的名字是啥 */
        name: item.name,
        /** 导入的路径是啥 */
        file: file,
        /** 导入类型 */
        type: item.isDefault ? ImportType.ImportDefault : ImportType.ImportItem,
      }
    })
  }
}


</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent full-width>

    <q-card class="full-width">
      <q-card-section>
        <div class="text-h6">从文件中导入</div>
      </q-card-section>

      <q-separator/>

      <q-form @submit="onOKClick">

        <q-card-section v-if="options.length > 0">
          <q-select v-model="select" standout dense
                    :options="options"
                    label="请选择从哪里导入"
                    emit-value
                    map-options
          >
          </q-select>
        </q-card-section>
        <q-card-section v-else>
          <DropSelectFile @select-file="selectFile"></DropSelectFile>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="关闭" color="dark" v-close-popup/>
          <q-btn flat label="保存" color="primary" type="submit"/>
        </q-card-actions>
      </q-form>
    </q-card>

  </q-dialog>
</template>
