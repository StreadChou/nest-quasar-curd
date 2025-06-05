<script setup lang="ts">
import {useQuasar} from "quasar";
import {ref, watch} from "vue";
import {AttrConfig} from "app/type/JsonFileDefine/Attr";
import {UserInputError} from "src/app/ErrorHandler/UserInputError";
import AttrEditorDialog from "components/Attr/AttrEditorDialog.vue";
import {AttrType} from "app/type/JsonFileDefine/Columns/AttrType/AttrType";
import {AttrColumnDecoratorType} from "app/type/JsonFileDefine/Columns/ColumnsType";
import AttrBaseInfo from "components/Attr/AttrBaseInfo.vue";


const $q = useQuasar();
const props = defineProps<{
  modelValue: Array<AttrConfig>
}>()

const emit = defineEmits(["update:modelValue"])
const model = ref<Array<AttrConfig>>(props.modelValue || []);


watch(model, () => {
  emit("update:modelValue", model.value)
}, {deep: true})


// 增加字段
const addAttr = (data: AttrConfig, index?: number, type?: "top" | "bottom") => {
  if (!data.name) throw new UserInputError('请输入字段名称');
  if (model.value.find(item => item.name === data.name)) throw new UserInputError('该字段已经存在');
  if (typeof index == "number" && type) {
    const start = Math.max(0, index + (type === "top" ? 0 : 1), 0)
    model.value.splice(start, 0, data)
  } else {
    model.value.push(data)
  }
}

// 增加字段
const addAttrDialog = (index?: number, type?: "top" | "bottom") => {
  $q.dialog({title: '请输入', message: '请输入字段名称?', prompt: {model: '', type: 'text', standout: true,},})
    .onOk((data: string) => {
      const item: AttrConfig = {
        name: data,
        attrTpe: AttrType.Column,
        attrDecoratorType: AttrColumnDecoratorType.Column,
      };
      addAttr(item, index, type)
    })
}

// 向上移动
const moveTop = (index: number) => {
  if (index === 0) return null;
  const odd = model.value.splice(index, 1)[0] as AttrConfig;
  model.value.splice(index - 1, 0, odd);
}

// 向下移动
const moveBottom = (index: number) => {
  if (index === model.value.length - 1) return null;
  const odd = model.value.splice(index, 1)[0] as AttrConfig;
  model.value.splice(index + 1, 0, odd);
}

// 删除字段
const deleteAttr = (index: number) => {
  model.value.splice(index, 1);
}

// 编辑自动
const editorAttr = (index: number) => {
  const raw = model.value[index];

  $q.dialog({
    component: AttrEditorDialog,
    componentProps: {data: raw},
  }).onOk((target: AttrConfig) => {
    model.value[index] = target;
  })
}

const tab = ref("");

</script>

<template>
  <q-markup-table class="text-left" flat bordered separator="cell">
    <thead>
    <tr>
      <th>字段名称</th>
      <th>备注</th>
      <th>字段类型</th>
      <th>装饰器类型</th>
      <th>排序</th>
      <th>操作</th>
    </tr>
    </thead>
    <tbody>
    <template v-for="(attr, key) of model" :key="attr.name">
      <tr>
        <td>{{ attr.name }}</td>
        <td>{{ attr.mark }}</td>
        <td>{{ attr.attrTpe }}</td>
        <td>{{ attr.attrDecoratorType }}</td>
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
                 @click="addAttrDialog(key,  'top')"></q-btn>
          <q-btn flat dense size="sm" color="positive" icon="expand_more" label="下方新增"
                 @click="addAttrDialog(key, 'bottom')"></q-btn>
        </td>
      </tr>
    </template>
    <tr>
      <td colspan="6">
        <q-btn class="full-width" color="positive" flat dense label="新增" @click="addAttrDialog()"></q-btn>
      </td>
    </tr>
    <tr>
      <td colspan="6" class="">
        <q-btn label="增加createdAt" flat dense no-caps
               @click="addAttr({
                           name: `createdAt`,
                           mark: `创建时间`,
                           attrTpe: AttrType.Column,
                           attrDecoratorType: AttrColumnDecoratorType.CreateDateColumn,
                           columnOptions: {},
                         })"/>
        <q-btn label="增加updatedAt" flat dense no-caps
               @click="addAttr({
                            name: `updatedAt`,
                            mark: `更新时间`,
                            attrTpe: AttrType.Column,
                            attrDecoratorType: AttrColumnDecoratorType.UpdateDateColumn,
                            columnOptions: {},
                         })"/>
        <q-btn label="增加deletedAt" flat dense no-caps
               @click="addAttr({
                           name: `deletedAt`,
                           mark: `删除时间`,
                           attrTpe: AttrType.Column,
                           attrDecoratorType: AttrColumnDecoratorType.DeleteDateColumn,
                           columnOptions: {},
                         })"/>
      </td>
    </tr>

    </tbody>
  </q-markup-table>

</template>

<style scoped>

</style>
