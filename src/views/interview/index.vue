<script setup lang='ts'>
import { NAutoComplete, NButton, NInput } from 'naive-ui'
import { ref } from 'vue'
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'
import { useBasicLayout } from '@/hooks/useBasicLayout'

const prompt = ref<string>('')
const { isMobile } = useBasicLayout()

async function getMicrophoneAccess() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    // 麦克风权限已被授予，现在可以使用音频流
    console.log('麦克风权限已授予')
  }
  catch (err) {
    // 用户拒绝了麦克风权限或设备不支持
    console.error('获取麦克风权限失败:', err)
  }
}

getMicrophoneAccess()

async function startCopilot() {
  const token = 'c8675da12f844715b611d6b243733078'
  const region = 'eastus'
  const language = 'en-US'
  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(token, region)
  speechConfig.speechRecognitionLanguage = language
  const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput()
  const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig)

  const sdk = SpeechSDK

  recognizer.recognized = (sender, event) => {
    if (sdk.ResultReason.RecognizedSpeech === event.result.reason && event.result.text.length > 0) {
      const text = event.result.text
      prompt.value = `${prompt.value}\n${text}`
    }
    else if (sdk.ResultReason.NoMatch === event.result.reason) {
      console.log('Speech could not be recognized')
    }
  }

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia !== undefined)
    console.log('WebRTC is supported!')
  else
    console.log('WebRTC is not supported.')

  recognizer.startContinuousRecognitionAsync(
    () => {
      // window.console.log('recognition started')
    },
    (err) => {
      window.console.error('recogniton start failed', err)
    })
}
async function handleSubmit() {

}
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <NAutoComplete v-model:value="prompt">
      <template #default="{ handleInput, handleBlur, handleFocus }">
        <NInput
          ref="inputRef"
          v-model:value="prompt"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: isMobile ? 4 : 8 }"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </template>
    </NAutoComplete>

    <NButton type="primary" @click="startCopilot">
      确定
    </NButton>
  </div>
</template>
