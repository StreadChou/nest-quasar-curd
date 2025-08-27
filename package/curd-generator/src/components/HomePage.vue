<script setup lang="ts">
import {onMounted, ref, computed} from "vue";
import {useDataStore} from "stores/data-store";
import {useHistoryStore} from "stores/history-store";
import {InvokeProxy} from "src/library/InvokeProxy";
import {InvokeErrorHandler} from "src/helper/ErrorHelper";
import DropSelectFile from "components/DropSelectFile.vue";

const dataStore = useDataStore();
const historyStore = useHistoryStore();

const isDragging = ref(false)

const selectFile = async (file: string) => {
  if (!file) return null;
  try {
    await dataStore.openProject(file)
  } catch (error: any) {
    console.error('Error opening project:', error);
    alert(`打开项目失败: ${error.message}`);
  }
}

const hasHistory = computed(() => historyStore.historyData.length > 0);

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN');
}

const confirmRemove = (item: any) => {
  if (confirm(`确定要从历史记录中移除项目 "${item.project}" 吗？`)) {
    historyStore.removeItem(item);
  }
}

onMounted(() => {
  historyStore.loadFromStorage();
})
</script>

<template>
  <div class="home-page">
    <div class="welcome-section q-pa-lg">
      <div class="text-center q-mb-xl">
        <q-icon name="construction" size="80px" color="primary" class="q-mb-md"/>
        <h2 class="text-h3 text-primary q-mb-md">CRUD 代码生成器</h2>
        <p class="text-h6 text-grey-7">快速生成 Nest.js + Quasar 的增删改查代码</p>
      </div>
      
      <DropSelectFile @select-file="selectFile" class="q-mb-xl"/>
    </div>

    <div v-if="hasHistory" class="history-section q-pa-lg">
      <div class="row items-center q-mb-md">
        <q-icon name="history" size="24px" class="q-mr-sm"/>
        <span class="text-h5">最近项目</span>
        <q-space/>
        <q-btn 
          flat 
          dense 
          icon="clear_all" 
          label="清空历史" 
          @click="historyStore.clearAll()"
          v-if="hasHistory"
        />
      </div>
      
      <div class="history-grid">
        <q-card 
          v-for="item in historyStore.historyData" 
          :key="item.file_path"
          class="history-card cursor-pointer"
          @click="dataStore.openProject(item.file_path)"
          bordered
          flat
        >
          <q-card-section>
            <div class="row items-center no-wrap">
              <q-icon name="folder" color="primary" size="32px" class="q-mr-md"/>
              <div class="col">
                <div class="text-h6 ellipsis">{{ item.project }}</div>
                <div class="text-caption text-grey-6 ellipsis q-mt-xs">
                  {{ item.file_path }}
                </div>
              </div>
            </div>
            
            <div class="row items-center justify-between q-mt-md">
              <div class="project-stats">
                <q-chip dense color="primary" text-color="white" size="sm">
                  {{ item.modules_number }} 模块
                </q-chip>
                <q-chip dense color="secondary" text-color="white" size="sm" class="q-ml-xs">
                  {{ item.models_number }} 模型
                </q-chip>
              </div>
              
              <div class="text-caption text-grey-6">
                {{ formatDate(item.updated_at) }}
              </div>
            </div>
          </q-card-section>
          
          <q-card-actions align="right">
            <q-btn 
              flat 
              dense 
              icon="open_in_new" 
              color="primary"
              @click.stop="dataStore.openProject(item.file_path)"
            >
              <q-tooltip>打开项目</q-tooltip>
            </q-btn>
            <q-btn 
              flat 
              dense 
              icon="delete_outline" 
              color="negative"
              @click.stop="confirmRemove(item)"
            >
              <q-tooltip>从历史记录中移除</q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    
    <div v-else class="no-history q-pa-lg text-center">
      <q-icon name="folder_open" size="64px" color="grey-5" class="q-mb-md"/>
      <div class="text-h6 text-grey-6">暂无历史项目</div>
      <div class="text-body2 text-grey-5">打开或创建一个项目开始使用</div>
    </div>

    <div class="features-section q-pa-lg q-mt-xl">
      <div class="text-center q-mb-lg">
        <h3 class="text-h4 text-grey-8">主要功能</h3>
      </div>
      
      <div class="row q-gutter-lg justify-center">
        <div class="col-12 col-md-3">
          <q-card flat bordered class="feature-card">
            <q-card-section class="text-center">
              <q-icon name="auto_awesome" size="48px" color="primary" class="q-mb-md"/>
              <div class="text-h6">自动生成代码</div>
              <div class="text-body2 text-grey-6 q-mt-sm">
                自动生成 Controller、Service、Entity 等文件
              </div>
            </q-card-section>
          </q-card>
        </div>
        
        <div class="col-12 col-md-3">
          <q-card flat bordered class="feature-card">
            <q-card-section class="text-center">
              <q-icon name="settings" size="48px" color="secondary" class="q-mb-md"/>
              <div class="text-h6">可视化配置</div>
              <div class="text-body2 text-grey-6 q-mt-sm">
                通过可视化界面配置数据模型和关系
              </div>
            </q-card-section>
          </q-card>
        </div>
        
        <div class="col-12 col-md-3">
          <q-card flat bordered class="feature-card">
            <q-card-section class="text-center">
              <q-icon name="rocket_launch" size="48px" color="positive" class="q-mb-md"/>
              <div class="text-h6">快速开发</div>
              <div class="text-body2 text-grey-6 q-mt-sm">
                大幅减少重复代码编写，提升开发效率
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.welcome-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  margin: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.history-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  margin: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
}

.history-card {
  transition: all 0.3s ease;
}

.history-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
}

.project-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.no-history {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  margin: 16px;
}

.features-section {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  margin: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.05);
}

.feature-card {
  height: 200px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

@media (max-width: 768px) {
  .history-grid {
    grid-template-columns: 1fr;
  }
  
  .welcome-section,
  .history-section,
  .features-section {
    margin: 8px;
    padding: 16px;
  }
}
</style>
