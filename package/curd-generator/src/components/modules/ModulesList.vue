<script setup lang="ts">

import ModuleListItem from "components/modules/ModuleListItem.vue";
</script>

<template>
  <div class="row q-col-gutter-sm">
    <div class="col-3">
      <q-btn class="full-height full-width" icon="add" label="增加module" color="primary"
             to="/module/form/0"
      ></q-btn>
    </div>

    <template v-for="i in 10">
      <div class="col-3">
        <ModuleListItem></ModuleListItem>
      </div>
    </template>

  </div>
</template>

<style scoped>

</style>
