<script setup lang="ts">
import {computed, ref} from "vue";
import {ColumnsDefine, FormItemProps, TypeExtensionForExtension} from "../../../index";
import {AbstractTypeHandler} from "../AbstractTypeHandler";

const props = defineProps<FormItemProps>();
const handler = ref<AbstractTypeHandler>(props.handler);
const column = ref<ColumnsDefine>(handler.value.column)
const editor_bind = ref(Object.assign({standout: true}, handler.value.editor_bind(),))


const emits = defineEmits<{ (e: 'update:modelValue', value: string | number): void; }>();

const data = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
});


const typeExtension = ref<TypeExtensionForExtension>(column.value.type_extension);


</script>

<template>
  <div class="row q-gutter-x-md">
    <div class="col">
      <q-input v-model="data"
               type="textarea"
               v-bind="editor_bind"
               :label="`${column.label}(${columns_key})`"
               :disable="handler.isDisable(create_or_update)"
      ></q-input>
    </div>
    <div class="col bg-grey-3 q-pa-md rounded-borders" v-if="typeExtension.editor_mark">
      <div v-html="typeExtension.editor_mark">

      </div>
      <!--            <div>{{ typeExtension.editor_mark }}</div>-->
      <!--      <div class="q-mt-md">-->
      <!--        <q-markup-table flat dense class="text-left" style="background: none" bordered separator="cell">-->
      <!--          <tbody>-->
      <!--          <template v-for="item of typeExtension.key_define">-->
      <!--            <tr>-->
      <!--              <td>{{ item.key }}</td>-->
      <!--              <td>{{ item.required }}</td>-->
      <!--              <td>{{ item.mark }}</td>-->
      <!--            </tr>-->
      <!--          </template>-->

      <!--          </tbody>-->
      <!--        </q-markup-table>-->
      <!--      </div>-->
    </div>

  </div>

</template>

<style scoped>

</style>