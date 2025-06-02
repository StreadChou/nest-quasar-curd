<script setup lang="ts">
import {ref} from "vue";
import {useDataStore} from "stores/data-store";
import {useHistoryStore} from "stores/history-store";

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

  console.log(files[0].path)
}

const selectFile = () => {
  dataStore.openPoject();
  console.log('文件选择按钮点击')
}

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
    <div class="q-mt-md">
      <q-markup-table class="bg-none" flat separator="cell" bordered>
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
        <tr>
          <td>项目名字</td>
          <td>/User/..../test.nqcurd</td>
          <td>1</td>
          <td>1</td>
          <td>2025-05-01 23:00:00</td>
          <td>2025-05-01 23:00:00</td>
          <td>
            <q-btn flat dense label="打开" color="primary"/>
            <q-btn flat dense label="移除" color="primary"/>
          </td>
        </tr>
        </tbody>
      </q-markup-table>
      {{ historyStore.historyData }}
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
