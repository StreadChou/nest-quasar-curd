<script setup lang="ts">
import {AbstractViewData, DefaultRemoveDialogVue, FindAllResponse, HomeProps} from "../index";
import {onMounted, ref, toRefs} from "vue";

type EntityType = any;


const props = withDefaults(defineProps<HomeProps>(), {
  request_body: {},
  table_bind: () => ({
    class: "text-left",
    flat: true,
    bordered: true,
    separator: "cell",
    "wrap-cells": true,
  })
})

const {request_body} = toRefs(props);
const ViewData = ref<AbstractViewData<EntityType>>(props.view_data ? new props.view_data(props.api) : undefined);

const EntityList = ref<FindAllResponse<EntityType>>({data: []});
const show_columns = ref<string[]>(ViewData.value.HomeShowColumns)


/** 请求数据 */
const fetch_entity = async () => {
  console.log(props)
  if (!ViewData.value?.fetch_entity_list) return null;

  const axios_response = await ViewData.value.fetch_entity_list(request_body.value);
  EntityList.value = axios_response.data;
}

/** 点击删除 */
const click_delete = async (entity: EntityType) => {
  $q.dialog({
    component: DefaultRemoveDialogVue,
    componentProps: {

      api: props.api,
      view_data: ViewData.value,

      delete_id: entity.id,
      options: entity,
    }
  }).onOk(() => {
    fetch_entity();
  })
}


onMounted(() => {
  fetch_entity();
})

</script>

<template>
  <div class="full-width">
    <q-markup-table v-bind="table_bind || {}">
      <thead v-bind="thead_bind || {}">

      <tr v-if="$slots.table_header">
        <th :colspan="show_columns.length + 1">
          <slot name="table_header"></slot>
        </th>
      </tr>

      <tr v-bind="tr_bind || {}">
        <template v-for="show_column of show_columns">
          <th v-bind="th_bind || {}">
            {{ ViewData.columns[show_column].label }}
          </th>
        </template>

        <th>操作</th>
      </tr>

      </thead>
      <tbody v-bind="tbody_bind || {}">
      <template v-for="entity of EntityList.data">
        <tr v-bind="tr_bind || {}">

          <template v-for="show_column of show_columns">
            <td v-bind="td_bind || {}">
              <component
                  :is="ViewData.columnsTypeHandler[show_column].td_component()"
                  :columns_key="show_column"
                  :entity="entity"
                  :handler="ViewData.columnsTypeHandler[show_column]"
              ></component>
            </td>
          </template>

          <td v-bind="td_bind || {}">
            <slot name="handle_button" :data="entity" :ViewData="ViewData">
              <slot name="handle_button_before" :data="entity"></slot>
              <template v-if="ViewData.define?.frontend?.form_page">
                <q-btn color="primary" flat dense label="编辑" :to="ViewData.getFormPage(entity.id)"></q-btn>
              </template>
              <q-btn color="negative" flat dense label="删除" @click="click_delete(entity)"></q-btn>
              <slot name="handle_button_after" :data="entity" :ViewData="ViewData"></slot>
            </slot>
          </td>

        </tr>
      </template>

      </tbody>
    </q-markup-table>
  </div>
</template>

<style scoped>

</style>