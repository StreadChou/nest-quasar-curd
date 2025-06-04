`<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8 q-py-xs" height-hint="58">
      <q-toolbar>
        <q-btn flat dense round @click="dataStore.leftDrawerOpen = !dataStore.leftDrawerOpen" aria-label="Menu"
               icon="menu"/>

        <q-space/>

        <div class="q-gutter-sm row items-center no-wrap">
          <CreateProject></CreateProject>
          <q-btn round dense flat color="grey-8" icon="home" @click="viewStore.openHomePanel()">
            <q-tooltip>主页</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="dataStore.leftDrawerOpen" show-if-above bordered class="bg-grey-2" :width="240">
      <q-scroll-area class="fit">
        <q-tree
          :nodes="dataStore.treeNodes"
          node-key="viewId"
          selected-color="primary"
          v-model:selected="dataStore.treeSelected"
          default-expand-all
        />
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import {useDataStore} from "stores/data-store";
import CreateProject from "components/CreateProject.vue";
import {useViewStore} from "stores/view-store";

const dataStore = useDataStore();
const viewStore = useViewStore();

</script>

<style lang="sass">
.YL

  &__toolbar-input-container
    min-width: 100px
    width: 55%

  &__toolbar-input-btn
    border-radius: 0
    border-style: solid
    border-width: 1px 1px 1px 0
    border-color: rgba(0, 0, 0, .24)
    max-width: 60px
    width: 100%

  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem

    &:hover
      color: #000
</style>
`
