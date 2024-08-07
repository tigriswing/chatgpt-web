<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/store'

const userStore = useUserStore()

const options = ref(userStore.getAllChatModel())

const selectedLabel = ref('Select an option')

onMounted(() => {
  selectedLabel.value = userStore.chatModel.label
})

const dropdown = ref<HTMLElement | null>(null)
const isShowDropdown = ref(false)
const hoveredIndex = ref(0)

const toggleDropdown = () => {
  isShowDropdown.value = !isShowDropdown.value
}
const hoverItem = (index: number) => {
  hoveredIndex.value = index
}

const leaveItem = () => {
  hoveredIndex.value = 0
}

function handleClick(key: string) {
  const selectedOption = options.value.find(option => option.key === key)
  if (selectedOption) {
    userStore.setUserChatModel(selectedOption)
    selectedLabel.value = selectedOption.label
  }
  toggleDropdown()
}
</script>

<template>
  <div ref="dropdown" class="dropdown">
    <div class="flex items-center mb-2 cursor-pointer text-black hover:bg-gray-100 p-2 dropdown-top" @click="toggleDropdown">
      <span class="mr-2">{{ selectedLabel }}</span>
      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    <div v-if="isShowDropdown" class="dropdown-content">
      <div
        v-for="(item, index) in options" :key="index" class="dropdown-item"
        @mouseenter="hoverItem(index)" @mouseleave="leaveItem"
        @click="handleClick(item.key)"
      >
        <div class="flex flex-col text-left">
          <div class="text-black">
            {{ item.label }}
          </div>
          <div>{{ item.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: block;
  position: absolute;
  min-width: 200px;
  padding: 10px;
  background-color: white;
  box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.2);
  border-radius: 8px;
  z-index: 1;
}

.dropdown-top:hover {
  border-radius: 8px;
}

.dropdown-item {
  display: flex;
  padding: 10px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.dropdown-item img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.dropdown-item:hover {
  background-color: #f1f1f1;
}
</style>
