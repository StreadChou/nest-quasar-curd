<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {useDataStore} from "stores/data-store";
import {ModelsItem} from "app/type/JsonFileDefine/Index";
import {useQuasar} from "quasar";

const route = useRoute();

const $q = useQuasar();
const dataStore = useDataStore();

const module = ref<string>(route.params.module as string)
const form = ref<ModelsItem>({})

const save = async () => {
  dataStore.setModel(module.value, form.value);
  await dataStore.saveData()
};

const init = () => {
  const model = route.params.model as string
  // 如果是有model的话
  if (parseInt(model) !== 0) {
    const data = dataStore.getModel(module.value, model)
    form.value = JSON.parse(JSON.stringify(data));
  }

  form.value.attrs = form.value.attrs || [];
}

const addCreateAt = () => {
  if (!form.value?.attrs) return null;
  form.value.attrs.push({
    name: "createdAt",
    mark: "创建时间",
  })
}

const addUpdateAt = () => {
  if (!form.value?.attrs) return null;
  form.value.attrs.push({
    name: "updatedAt",
    mark: "更新时间",
  })
}


const addDeleteAt = () => {
  if (!form.value?.attrs) return null;
  form.value.attrs.push({
    name: "deletedAt",
    mark: "删除时间",
  })
}

const addAttr = (index?: number, type?: "top" | "bottom") => {
  $q.dialog({
    title: '请输入',
    message: '请输入字段名称?',
    prompt: {
      model: '',
      type: 'text', // optional
      standout: true,
    },
  }).onOk((data: string) => {
    if (!form.value?.attrs) return null;
    if (!data) {
      $q.notify({
        message: '请输入字段名称',
        color: 'negative',
        position: 'top',
      })
      return null;
    }
    if (form.value.attrs.find(item => item.name === data)) {
      $q.notify({
        message: '该字段已经存在',
        color: 'negative',
        position: 'top',
      })
      return null;
    }
    if (Number.isInteger(index) && type) {
      // [].splice();
      const start = Math.max(0, index + (type === "top" ? 0 : 1), 0)
      form.value.attrs.splice(start, 0, {name: data,})
    } else {
      form.value.attrs.push({name: data,})
    }

  })
}

const moveTop = (index: number) => {
  if (!form.value?.attrs) return null;
  if (index === 0) return null;
  form.value.attrs.splice(index - 1, 0, form.value.attrs.splice(index, 1)[0]);
}

const moveBottom = (index: number) => {
  if (!form.value?.attrs) return null;
  if (index === form.value.attrs.length - 1) return null;
  form.value.attrs.splice(index + 1, 0, form.value.attrs.splice(index, 1)[0]);
}

const deleteAttr = (index: number) => {
  if (!form.value?.attrs) return null;
  form.value.attrs.splice(index, 1);
}

const editorAttr = (index: number) => {
  if (!form.value?.attrs) return null;
  $q.dialog({}).onOk((data: string) => {
    form.value.attrs[index] = data;
  })
}


onMounted(() => {
  init();
})
</script>

<template>
  <q-page>
    <q-banner dense inline-actions class="text-white bg-teal">
      您正在 编辑/新增 modules -> model
      <template v-slot:action>
        <q-btn flat color="white" label="返回到Modules列表" to="/"/>
        <q-btn flat color="white" label="预览"/>
      </template>
    </q-banner>

    <div class="q-pa-md">
      <div class="q-gutter-y-md">
        <div>
          <q-input standout v-model="form.name" label="Model名称" :disable="true"/>
        </div>

        <div class="q-gutter-x-md">
          <q-btn label="增加createdAt" @click="addCreateAt"></q-btn>
          <q-btn label="增加updatedAt" @click="addUpdateAt"></q-btn>
          <q-btn label="增加deletedAt" @click="addDeleteAt"></q-btn>
        </div>

        <div>
          <q-markup-table class="text-left" bordered separator="cell">
            <thead>
            <tr>
              <th>字段名称</th>
              <th>备注</th>
              <th>类型</th>
              <th>排序</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <template v-for="(attr, key) of form.attrs" :key="attr.name">
              <tr>
                <td>{{ attr.name }}</td>
                <td>{{ attr.mark }}</td>
                <td>{{ attr.type }}</td>
                <td>
                  <q-btn flat dense icon="expand_less" @click="moveTop(key)"></q-btn>
                  <q-btn flat dense icon="expand_more" @click="moveBottom(key)"></q-btn>
                </td>
                <td>
                  <q-btn flat dense size="sm" color="negative" icon="delete" label="移除"
                         @click="deleteAttr(key)"></q-btn>
                  <q-btn flat dense size="sm" color="primary" icon="edit" label="编辑"
                         @click="editorAttr(key)"></q-btn>
                  <q-btn flat dense size="sm" color="positive" icon="expand_less" label="上方新增"
                         @click="addAttr(key,  'top')"></q-btn>
                  <q-btn flat dense size="sm" color="positive" icon="expand_more" label="下方新增"
                         @click="addAttr(key, 'bottom')"></q-btn>
                </td>
              </tr>
            </template>
            <tr>
              <td colspan="5">
                <q-btn class="full-width" color="positive" flat dense label="新增" @click="addAttr()"></q-btn>
              </td>
            </tr>

            </tbody>
          </q-markup-table>
        </div>
      </div>

      <div class="q-mt-md">
        <q-btn class="full-width" label="保存" color="primary" @click="save"></q-btn>
      </div>

    </div>
  </q-page>
</template>

<style scoped>

</style>
