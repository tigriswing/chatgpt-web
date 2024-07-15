<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { NButton, NDropdown } from 'naive-ui'
import { useUserStore } from '@/store'

const userStore = useUserStore()

const options = ref(userStore.getAllChatModel())

const selectedLabel = ref('Select an option')

onMounted(() => {
  selectedLabel.value = userStore.chatModel.label
})

function handleClick(key: any) {
  const selectedOption = options.value.find(option => option.key === key)
  if (selectedOption) {
    userStore.setUserChatModel(selectedOption)
    selectedLabel.value = selectedOption.label
  }
}
</script>

<template>
  <NDropdown :options="options" @select="handleClick">
    <NButton>{{ selectedLabel }}</NButton>
  </NDropdown>
</template>
