<template>
  <q-page>
    <div class="column">
      <div>
        <q-tabs v-model="tab" dense no-caps inline-label align="left" class="bg-purple text-white shadow-2">
          <q-tab name="mails" icon="home"/>
          <q-tab name="alarms" label="模型: User"/>
          <q-tab name="movies" label="模型: User"/>
        </q-tabs>
      </div>
      <div class="col">
        <HomePage></HomePage>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import HomePage from "components/HomePage.vue";

const tab = ref('mails')


</script>


