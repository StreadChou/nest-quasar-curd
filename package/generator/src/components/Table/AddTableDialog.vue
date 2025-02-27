<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">增加Table</div>
      </q-card-section>

      <q-separator/>

      <q-form @submit="onOKClick">

        <q-card-section style="max-height: 50vh" class="scroll">

          <div class="q-gutter-y-sm">
            <q-input v-model="form.Name" standout dense label="名称"/>
            <q-input v-model="form.ClassName" standout dense label="类名"/>
            <q-input v-model="form.Restful" standout dense label="Restful接口前缀"/>
          </div>


          <p v-for="n in 15" :key="n">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit
            voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem
            aut, natus minima, porro labore.</p>
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
import {Table} from "app/src-ssr/types/Table";
import {useTableStore} from "stores/table-store";

const $q = useQuasar();
defineEmits([
  ...useDialogPluginComponent.emits
])

const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()

const form = ref<Table>({
  Name: "用户表",
  ClassName: "User",
  Restful: "User",
  columns: {},
})

const tableStore = useTableStore();


async function onOKClick() {
  const exist = tableStore.tableList.some(ele => ele.ClassName == form.value.ClassName)
  if (exist) {
    return $q.notify({message: "错误: 存在相同表名"})
  }

  tableStore.tableList.push(JSON.parse(JSON.stringify(form.value)));
  await tableStore.saveTableView();

  onDialogOK()
}
</script>
