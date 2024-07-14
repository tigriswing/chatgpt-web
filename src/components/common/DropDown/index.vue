<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { NButton, NDropdown } from 'naive-ui'

const options = ref([
  { label: 'DeepSeek', key: '1' },
  { label: 'GPT3.5', key: '2' },
  { label: 'GPT4.0', key: '3' },
])

const selectedLabel = ref('Select an option')

onMounted(() => {
  selectedLabel.value = options.value[0].label
})

function handleClick(key: any) {
  const selectedOption = options.value.find(option => option.key === key)
  if (selectedOption)
    selectedLabel.value = selectedOption.label
}
</script>

<template>
  <NDropdown :options="options" @select="handleClick">
    <NButton>{{ selectedLabel }}</NButton>
  </NDropdown>
</template>
