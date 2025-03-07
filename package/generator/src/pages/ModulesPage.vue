<script setup lang="ts">

</script>

<template>
  <q-page>
    <div class="q-py-lg q-px-md">
      <q-btn label="新增" class="full-width" dense color="secondary"/>
    </div>
    <div class="row q-col-gutter-sm q-px-md">
      <template v-for="n in 10">
        <div class="col-3">
          <q-card>
            <q-card-section>
              <div class="text-caption">xxxModule</div>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-section style="min-width: 300px">
              <template v-for="i in 10">
                <div class="row">
                  <div class="col">
                    User-用户表
                  </div>
                  <div>
                    <q-btn label="删除" flat dense/>
                  </div>
                </div>
              </template>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-actions align="right">
              <q-btn label="编辑" flat dense/>
              <q-btn label="删除" flat dense/>
            </q-card-actions>
          </q-card>
        </div>
      </template>
    </div>

  </q-page>
</template>

<style scoped>

</style>
