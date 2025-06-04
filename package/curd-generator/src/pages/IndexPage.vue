<template>
  <q-page>
    <div class="column">
      <div>
        <q-tabs v-model="viewStore.active"
                dense no-caps inline-label align="left"
                class="bg-purple text-white shadow-2"
        >

          <template v-for="item of viewStore.viewList">
            <q-tab :name="item.id" :icon="item.icon" :label="item.name"/>
          </template>

        </q-tabs>
      </div>

      <template v-for="item of viewStore.viewList">
        <div class="col" v-show="item.id == viewStore.active">
          <component :is="item.view" v-bind="item.props"></component>
        </div>
      </template>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import {useViewStore} from "stores/view-store";
import {onMounted} from "vue";

const viewStore = useViewStore();

onMounted(() => {
  viewStore.openHomePanel();
})


</script>


