<script setup lang="ts">
import {onMounted, ref, toRefs, watch} from "vue";
import {FindAllBody, FindAllResponse} from "nest-quasar-curd";
import CrudComponentRemove from "nest-quasar-curd/src/frontend/view/CrudComponentRemove.vue"
import {useQuasar} from "quasar";
import {AbstractViewData} from "nest-quasar-curd/src/frontend/view/AbstractViewData";

__IMPORT__

const $q = useQuasar();

interface Props {
  api: any,
  customerViewData?: AbstractViewData,
  requestBody?: FindAllBody,
}

const props = withDefaults(defineProps<Props>(), {
  requestBody: {},
})
const {requestBody} = toRefs(props);

/** 渲染页面需要的数据定义类 */
const ViewData = ref<AbstractViewData<__CLASS_NAME__Interface>>(
    props.customerViewData || new __CLASS_NAME__ViewData(props.api),
)
/** 数据列表 */
const entity_list = ref<FindAllResponse<__CLASS_NAME__Interface>>({data: []});
/** 请求数据 */
const fetch_entity = async () => {
  const axios_response = await ViewData.value.fetch_entity_list(requestBody.value);
  entity_list.value = axios_response.data;
}
// 监控请求
watch(requestBody, () => fetch_entity(), {deep: true, immediate: true})


/** 点击删除 */
const click_delete = async (entity: __CLASS_NAME__Interface) => {
  $q.dialog({
    component: CrudComponentRemove,
    componentProps: {
      api: props.api,
      ViewData: ViewData.value,
      delete_id: entity.id,
      restful: props.restful,
      options: entity,
    }
  }).onOk(() => {
    fetch_entity();
  })
}

onMounted(() => {
  fetch_entity().then();
})

</script>

<template>
  <div>
    <q-markup-table flat bordered separator="cell" class="text-left">
      <thead>

      <tr v-if="$slots.table_header">
        <th :colspan="ViewData.home_show_columns.length + 1">
          <slot name="table_header"></slot>
        </th>
      </tr>

      <tr>
        <template v-for="col of ViewData.home_show_columns">
          <th>
            {{ ViewData.columns[col].label }}
            <q-tooltip v-if="ViewData.columns[col].mark">{{ ViewData.columns[col].mark }}</q-tooltip>
          </th>
        </template>
        <th width="30px">操作</th>
      </tr>
      </thead>
      <tbody>
      <template v-for="item of entity_list.data" :key="item.id">
        <tr>
          <template v-for="col of ViewData.home_show_columns">
            <td>
              <slot :name="`show__${col}`" :data="item[col]" :entity="item">
                <component
                    :is="ViewData.columnsTypeHandler[col].td_component()"
                    :columns_key="col"
                    :entity="item"
                    :handler="ViewData.columnsTypeHandler[col]"
                ></component>
              </slot>
            </td>
          </template>
          <td>
            <slot name="handle_button" :data="item" :ViewData="ViewData">
              <slot name="handle_button_before" :data="item"></slot>
              <q-btn color="negative" flat dense label="删除" @click="click_delete(item)"></q-btn>
              <slot name="handle_button_after" :data="item" :ViewData="ViewData"></slot>
            </slot>
          </td>
        </tr>

      </template>
      </tbody>
    </q-markup-table>
    <div class="row justify-center q-mt-md" v-if="entity_list.pagination && entity_list.data.length > 0">
      <q-pagination
          v-model="requestBody.page"
          :max="Math.ceil(entity_list.pagination.total / entity_list.pagination.pageSize)"
          direction-links
          boundary-links
          flat
          color="primary"
          icon-first="skip_previous"
          icon-last="skip_next"
          icon-prev="fast_rewind"
          icon-next="fast_forward"
      />
    </div>

  </div>
</template>

<style scoped>

</style>
