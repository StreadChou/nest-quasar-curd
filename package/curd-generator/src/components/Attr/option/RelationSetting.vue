<script setup lang="ts">
import {useQuasar} from "quasar";
import {onMounted, ref, watch} from "vue";
import {AttrConfig} from "app/type/JsonFileDefine/Attr";
import ProjectImportExportDialog from "components/ImportSetting/ProjectImportExportDialog.vue";
import {ImportDataIc} from "app/type/TypescriptImport/ImportType";
import FileImportExportDialog from "components/ImportSetting/FileImportExportDialog.vue";

const $q = useQuasar();
const props = defineProps<{
  count: number,
  modelValue: AttrConfig | undefined
}>()

const emit = defineEmits(["update:modelValue"])
const model = ref<AttrConfig>(props.modelValue || {});
watch(model, () => {
  emit("update:modelValue", model.value)
}, {deep: true})

onMounted(() => {
  model.value.relationOptions = model.value.relationOptions || {}
  model.value.relationExtension = model.value.relationExtension || {}
})


const openProjectImport = () => {
  $q.dialog({
    component: ProjectImportExportDialog,
    componentProps: {count: props.count}
  }).onOk((data: ImportDataIc) => {
    model.value.relationExtension.target = data;
  })
}

const openFileImport = () => {
  $q.dialog({
    component: FileImportExportDialog,
    componentProps: {count: props.count}
  }).onOk((data: ImportDataIc) => {
    model.value.relationExtension.target = data;
  })
}

</script>

<template>
  <q-markup-table>
    <template v-if="model.relationExtension.target">
      <tr>
        <td class="text-white" style="background: rgb(30,30,30)">
          <div class="text-grey-7"># 示例如下:</div>
          <div v-if="model.relationExtension.targetKey">
            @OneToOne(() => {{ model.relationExtension.target.name }}, target =>
            target.{{ model.relationExtension.targetKey }})
          </div>
          <div v-else>
            @OneToOne(() => {{ model.relationExtension.target.name }})
          </div>

          <div v-if="model.relationExtension.JoinColumn">@JoinColumn()</div>
          <div>user: {{ model.relationExtension.target.name }};</div>
        </td>
      </tr>
    </template>
    <template v-else>
      <tr>
        <td>
          <q-btn flat dense label="从项目中导入" @click="openProjectImport"></q-btn>
          <q-btn flat dense label="从文件中导入" @click="openFileImport"></q-btn>
        </td>
      </tr>
    </template>

    <tr>
      <td>
        <q-checkbox v-model="model.relationExtension.JoinColumn" label="是否JoinColumn"/>
      </td>
    </tr>
    <tr>
      <td>
        <q-input v-model="model.relationExtension.targetKey" label="关联key" dense standout/>
      </td>
    </tr>
  </q-markup-table>
</template>

<style scoped>

</style>
