<script setup lang="ts">
import {useDialogPluginComponent} from 'quasar'
import {ref} from 'vue';
import {AxiosInstance} from "axios";
import {AbstractViewData} from "../data";

const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()
defineEmits([
  ...useDialogPluginComponent.emits,
])

const props = defineProps<{
  api: AxiosInstance,
  view_data: AbstractViewData,

  delete_id: string,
  options: Record<string, string | number>,
}>()
const input = ref('');


const onOKClick = async () => {
  if (input.value !== '立即移除') {
    return null;
  }
  const AxiosResponse = await props.ViewData.delete_entity(props.delete_id)
  onDialogOK()
}


</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent full-width>
    <q-card class="q-dialog-plugin">
      <q-card-section class="row">
        <div class="text-h6">是否删除 ID: {{ delete_id }}</div>
        <q-space/>
        <q-btn flat dense icon="close" label="取消" @click="onDialogCancel"></q-btn>
      </q-card-section>

      <q-separator/>

      <q-card-section class="fixed-section scroll q-gutter-y-md">
        <div>
          此操作不可逆, 移除后不可找回, 并且会移除 ID: {{ delete_id }} 相应的资源!<br>
          请在输入框内写入立即移除, 并且点击确定移除资源<br>
        </div>
        <q-input standout label="请输入 '立即移除' 四个字 " v-model="input">
          <template v-slot:append>
            <q-btn flat dense label="快速填写" @click="input = `立即移除`"></q-btn>
          </template>
          <template v-slot:after>
            <q-btn class="input-after-button" color="negative" label="确定移除" @click="onOKClick"></q-btn>
          </template>
        </q-input>
        <q-markup-table bordered flat separator="cell">
          <tbody>
          <template v-for="(item, key) of options">
            <tr>
              <td>
                {{ key }}
              </td>
              <td>
                {{ item }}
              </td>
            </tr>
          </template>
          </tbody>
        </q-markup-table>
      </q-card-section>

      <q-separator/>
    </q-card>
  </q-dialog>
</template>

<style scoped>

.fixed-section {
  max-height: 70vh;
}

</style>