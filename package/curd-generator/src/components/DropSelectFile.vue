<script setup lang="ts">
import {ref} from "vue";
import {InvokeProxy} from "src/library/InvokeProxy";
import {InvokeErrorHandler} from "src/helper/ErrorHelper";

const isDragging = ref(false)
const emit = defineEmits(["selectFile"])

const selectFile = async () => {
  const reply = await InvokeProxy("FileHandler.openFileDialog")
  if (reply.code != 0) return InvokeErrorHandler(reply);
  const file = reply?.data?.file;
  if (!file) return null;
  emit("selectFile", reply.data.file)
}

const createNewProject = async () => {
  const reply = await InvokeProxy("FileHandler.openDirSelectDialog")
  if (reply.code != 0) return InvokeErrorHandler(reply);
  const dir = reply?.data?.dir;
  if (!dir) return null;
  
  const projectName = prompt("请输入项目名称:", "新项目");
  if (!projectName) return;
  
  const createReply = await InvokeProxy("AppHandler.createProject", dir, projectName);
  if (createReply.code != 0) return InvokeErrorHandler(createReply);
  
  emit("selectFile", createReply.data.targetPath)
}

const drop = async (e: DragEvent) => {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (!files || files.length === 0) return
  
  // Get file path directly from the File object
  const file = files[0];
  if (file.type === "application/json" || file.name.endsWith(".json")) {
    emit("selectFile", file.path || file.name)
  } else {
    alert("请选择 JSON 格式的配置文件")
  }
}
</script>

<template>
  <div class="file-selector-container">
    <div
      class="drop-zone"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="drop"
      :class="{ 'drag-active': isDragging }"
    >
      <q-icon name="cloud_upload" size="64px" color="primary"/>
      <div class="text-h5 q-mt-md">拖拽 JSON 文件到此处</div>
      <div class="text-subtitle1 text-grey q-mb-md">支持 .json 格式的配置文件</div>

      <div class="button-group">
        <q-btn 
          label="打开项目" 
          color="primary" 
          size="lg"
          icon="folder_open"
          @click="selectFile"
          class="q-mr-md"
        />
        <q-btn 
          label="新建项目" 
          color="secondary" 
          size="lg"
          icon="create_new_folder"
          @click="createNewProject"
          outline
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-selector-container {
  max-width: 600px;
  margin: 0 auto;
}

.drop-zone {
  border: 3px dashed #e0e0e0;
  border-radius: 12px;
  padding: 60px 40px;
  text-align: center;
  transition: all 0.3s ease;
  background: #fafafa;
  position: relative;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.drop-zone:hover {
  border-color: #1976d2;
  background-color: rgba(25, 118, 210, 0.02);
}

.drop-zone.drag-active {
  border-color: #1976d2;
  background-color: rgba(25, 118, 210, 0.08);
  transform: scale(1.02);
}

.button-group {
  display: flex;
  gap: 16px;
  margin-top: 32px;
  flex-wrap: wrap;
  justify-content: center;
}

@media (max-width: 480px) {
  .drop-zone {
    padding: 40px 20px;
    min-height: 240px;
  }
  
  .button-group {
    flex-direction: column;
    align-items: center;
  }
  
  .button-group .q-btn {
    margin: 0 !important;
    width: 200px;
  }
}
</style>
