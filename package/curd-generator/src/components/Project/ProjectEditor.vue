<script setup lang="ts">
import CreateModule from "components/Module/CreateModule.vue";
import {useViewStore} from "stores/view-store";
import {ref, watch} from "vue";
import {useDataStore} from "stores/data-store";
import {ProjectConfig} from "app/type/JsonFileDefine/Project";
import FolderRelativeInput from "components/Common/FolderRelativeInput.vue";

const props = defineProps<{
  count: number,
  viewId: string,
}>()
const dataStore = useDataStore();

const viewStore = useViewStore();
const projectRecord = ref(dataStore.getProjectRecord(props.count));

const form = ref<Partial<ProjectConfig>>({
  name: projectRecord.value.json_data.project.name,
  backend_path: projectRecord.value.json_data.project.backend_path,
})

const selectBackendPath = () => {

}


const save = () => {
  dataStore.updateProject(props.count, form.value)
}

</script>

<template>
  <div>
    <div class="row class bg-grey q-pa-sm">
      <q-space></q-space>
      <div class="q-gutter-x-sm">
        <q-btn color="primary" dense size="sm" icon="save" @click="save"></q-btn>
        <CreateModule :count="count"></CreateModule>
        <q-btn color="negative" dense size="sm" icon="close" @click="viewStore.closePanel(viewId)"></q-btn>
      </div>
    </div>
    <div class="q-gutter-y-md">
      <q-input standout dense v-model="form.name" label="名称"></q-input>
      <FolderRelativeInput :count="count" v-model="form.backend_path"
                           label="后端导出路径(相对于配置文件)"
      ></FolderRelativeInput>
      <FolderRelativeInput :count="count" v-model="form.frontend_path"
                           label="前端导出路径(相对于配置文件)"
      >

      </FolderRelativeInput>
    </div>
    <div class="q-pa-md">
      <q-markup-table flat separator="cell" class="bg-none" dense bordered>
        <tbody class="text-center">
        <tr>
          <td colspan="2">文件路径: {{ projectRecord.file_path }}</td>
        </tr>
        <tr>
          <td>创建时间: {{ projectRecord.json_data.project.created_at }}</td>
          <td>更新时间: {{ projectRecord.json_data.project.updated_at }}</td>
        </tr>
        </tbody>
      </q-markup-table>
    </div>
  </div>
</template>

<style scoped>

</style>
