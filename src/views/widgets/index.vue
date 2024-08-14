<script setup lang='ts'>
import { ref } from 'vue'
import { NButton, NCol, NRow, NTabPane, NTabs } from 'naive-ui'
const activeTab = ref('tab1')

const tabs = ref([
  {
    name: 'tab1',
    label: '推荐',
    items: [
      { title: 'Title 1', description: 'Description 1', details: 'Detail 1' },
      { title: 'Title 2', description: 'Description 2', details: 'Detail 2' },
      { title: 'Title 3', description: 'Description 3', details: 'Detail 3' },
      { title: 'Title 4', description: 'Description 4', details: 'Detail 4' },
    ],
  },
  {
    name: 'tab2',
    label: '辅助写作',
    items: [
      { title: 'Title A', description: 'Description A', details: 'Detail A' },
      { title: 'Title B', description: 'Description B', details: 'Detail B' },
      { title: 'Title C', description: 'Description C', details: 'Detail C' },
      { title: 'Title D', description: 'Description D', details: 'Detail D' },
    ],
  },
])

const showDetails = (item: any) => {
  alert(item.details)
}
</script>

<template>
  <div class="h-full page_full">
    <NTabs v-model:value="activeTab" type="bar" :animated="true" justify-content="center" class="tab-container">
      <NTabPane v-for="tab in tabs" :key="tab.name" :name="tab.name" :label="tab.label">
        <NRow :gutter="16" justify="center">
          <NCol v-for="(item, index) in tab.items" :key="index" :span="8">
            <div class="item">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <NButton @click="showDetails(item)">
                查看详情
              </NButton>
            </div>
          </NCol>
        </NRow>
      </NTabPane>
    </NTabs>
  </div>
</template>

<style scoped>
.page_full {
    background-color: #eff3f7;
}

.tab-container {
    padding-top: 10px;
}

.item {
  margin: 16px; /* 每个项的上下左右 margin */
  padding: 16px; /* 可选项，添加内边距使内容更美观 */
  background-color: white;
  border-radius: 8px; /* 可选项，圆角 */
  text-align: center; /* 使标题和描述居中 */
}
</style>
