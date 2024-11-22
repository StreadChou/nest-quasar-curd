<script setup lang="ts">
import {AbstractViewData, FormProps} from "../index";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useQuasar} from "quasar";

type EntityType = any;

const $q = useQuasar();
const route = useRoute();
const router = useRouter()

const props = withDefaults(defineProps<FormProps>(), {})
// 数据源
const ViewData = ref<AbstractViewData<EntityType>>(props.view_data ? new props.view_data(props.api) : undefined);
// 编辑的资源ID
const id = ref<string>(props.id || route.params.id || "0");
// 是创建还是更新
const create_or_update = ref<"create | update">(id.value === "0" ? "create" : "update");
// 需要展示哪些字段
const show_columns = ref<string[]>(ViewData.value.getFormShowColumns(id.value == "0" ? null : id.value))
// 初始化的表单数据
const entity = ref<EntityType>({});
// 初始化的原始数据
const _the_init_entity = ref<EntityType>({});

const init = ref(false);
// 初始化数据
const init_data = async () => {
  const raw_entity = id.value === "0" ? undefined : (await ViewData.value.fetch_entity_one(id.value)).data;
  _the_init_entity.value = await ViewData.value.init_form_data({}, raw_entity);
  click_restore();
  init.value = true;
};

// 点击还原按钮
const click_restore = () => {
  entity.value = JSON.parse(JSON.stringify(_the_init_entity.value));
};


onMounted(async () => {
  await init_data();
})

</script>

<template>
  <div class="full-width">
    <div class="current-row q-gutter-y-md" v-if="init">
      <template v-for="show_column of show_columns">
        <div>
          {{ show_column }}
        </div>

      </template>
    </div>
  </div>
</template>

<style scoped>

</style>