<script setup lang="ts">

</script>

<template>
  <q-card>
    <q-card-section>
      <div class="text-h5 text-grey-9">
        User
        <span class="text-subtitle1">Modules</span>
      </div>
    </q-card-section>
    <q-separator/>

    <q-card-section>
      <q-list>

        <q-item clickable class="q-pa-none">
          <q-item-section>
            <q-item-label>模型: User</q-item-label>
            <q-item-label caption>
              <q-icon name="exit_to_app" size="xs" color="positive">
                <q-tooltip>将会导出</q-tooltip>
              </q-icon>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable class="q-pa-none">
          <q-item-section class="q-gutter-y-sm">
            <q-item-label>模型: Auth</q-item-label>
            <q-item-label caption>
              <q-icon name="exit_to_app" size="xs" color="positive">
                <q-tooltip>将会导出</q-tooltip>
              </q-icon>
            </q-item-label>
          </q-item-section>
        </q-item>

      </q-list>



    </q-card-section>

    <q-separator/>

    <q-card-section class="q-gutter-x-sm">

      <q-icon name="exit_to_app" size="sm" color="positive">
        <q-tooltip>将会导出</q-tooltip>
      </q-icon>

      <q-icon name="file_download" size="sm" color="positive">
        <q-tooltip>将会加入到modules列表</q-tooltip>
      </q-icon>

    </q-card-section>

    <q-separator/>

    <q-card-actions align="right">
      <q-btn flat dense color="primary" label="编辑"></q-btn>
    </q-card-actions>
  </q-card>
</template>

<style scoped>

</style>
