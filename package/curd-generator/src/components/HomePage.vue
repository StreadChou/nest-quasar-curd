<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useDataStore} from "stores/data-store";
import {useHistoryStore} from "stores/history-store";
import {InvokeProxy} from "src/library/InvokeProxy";
import {InvokeErrorHandler} from "src/helper/ErrorHelper";

const dataStore = useDataStore();
const historyStore = useHistoryStore();

const isDragging = ref(false)

const onDragOver = () => {
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const drop = async (e: DragEvent) => {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (!files || files.length === 0) return
  const absPath = await InvokeProxy("FileHandler.getPathForFile", files[0])
  await dataStore.openProject(absPath)
}

const selectFile = async () => {
  const reply = await InvokeProxy("FileHandler.openFileDialog")
  if (reply.code != 0) return InvokeErrorHandler(reply);
  const file = reply?.data?.file;
  if (!file) return null;
  await dataStore.openProject(reply.data.file)
}

onMounted(() => {
  historyStore.loadFromStorage();
})

</script>

<template>
  <div class="q-pa-md">
    <div
      class="drop-zone"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="drop"
      :class="{ 'drag-active': isDragging }"
    >
      <q-icon name="cloud_upload" size="48px"/>
      <div class="text-h6">拖拽文件到此处</div>
      <div class="text-subtitle1">或点击选择文件</div>

      <q-btn label="选择文件" color="primary" @click="selectFile"/>
    </div>
    <div class="q-mt-md row">
      <q-markup-table class="bg-none" flat separator="cell" bordered wrap-cells>
        <thead>
        <tr>
          <th colspan="7" class="text-center">
            <span class="text-h5">
              历史记录
            </span>
          </th>
        </tr>
        <tr class="text-left">
          <th>项目名称</th>
          <th>文件路径</th>
          <th>modules数量</th>
          <th>model数量</th>
          <th>最后编辑</th>
          <th>创建时间</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody class="text-left">
        <template v-for="item of historyStore.historyData">
          <tr>
            <td>{{ item.project }}</td>
            <td>
              {{ item.file_path }}
            </td>
            <td>{{ item.modules_number }}</td>
            <td>{{ item.models_number }}</td>
            <td>{{ item.updated_at }}</td>
            <td>{{ item.created_at }}</td>
            <td>
              <q-btn flat dense label="打开" color="primary" @click="dataStore.openProject(item.file_path)"/>
              <q-btn flat dense label="移除" color="primary" @click="historyStore.removeItem(item)"/>
            </td>
          </tr>
        </template>

        </tbody>
      </q-markup-table>
    </div>
  </div>
</template>


<style scoped>
.drop-zone {
  border: 2px dashed #ccc;
  border-radius: 5px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s;
}

.drop-zone.drag-active {
  border-color: #1976d2;
  background-color: rgba(25, 118, 210, 0.1);
}
</style>
