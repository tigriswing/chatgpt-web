<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInst } from 'naive-ui'
import { NButton, NForm, NFormItem, NImage, NInput, NSpace, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { loginByMobile } from '@/utils/request'
import { validatePassword, validatePhoneNumber } from '@/utils/functions/formatUtils'
import { t } from '@/locales'
import { useAuthStoreWithout } from '@/store/modules'
import chatosGPT from '@/assets/chatosGPT.png'

defineProps<Props>()

const model = reactive({
  phone: '',
  pwd: '',
})

interface Props {
  visible: boolean
}

const backgroundImageURL = '/login_bg.png'
const formRef = ref<HTMLElement & FormInst>()

const message = useMessage()
const router = useRouter()

const submitLoading = ref(false)
// 点击注册按钮
async function handleSubmit() {
  if (submitLoading.value)
    return
  if (!validatePhoneNumber(model.phone))
    return

  if (!validatePassword(model.pwd)) {
    message.warning('密码至少8位!')
    return
  }

  await formRef.value?.validate()
  try {
    submitLoading.value = true
    const authStore = useAuthStoreWithout()

    const { data } = await loginByMobile(model.phone, model.pwd)
    if (data !== undefined) {
      authStore.setDeviceId(data.deviceId)
      authStore.setUserId(data.userId)
      await router.push('/')
    }
    else { message.warning('登陆失败，请重试') }
  }
  catch (error: any) {
    const errorMessage = (error?.msg || error?.message) ?? t('common.wrong')
    message.warning(errorMessage)
  }
  finally {
    submitLoading.value = false
  }
}
const toRegister = async () => {
  await router.push('/register')
}
</script>

<template>
  <div class="h-full flex items-center justify-center bg-center bg-cover bg-no-repeat" :style="{ backgroundImage: `url(${backgroundImageURL})` }">
    <div class="w-full max-w-md p-4">
      <div class="flex flex-col justify-center items-center">
        <NImage :src="chatosGPT" class="mb-4" style="pointer-events: none;" />
        <h2 class="text-black text-center pb-4 text-2xl font-mono font-bold">
          请登录
        </h2>
      </div>

      <NForm ref="formRef" :model="model" size="medium" label-placement="left">
        <NFormItem path="phone">
          <NInput v-model:value="model.phone" placeholder="请输入手机号" class="h-12 flex items-center" />
        </NFormItem>

        <NFormItem path="pwd">
          <NInput v-model:value="model.pwd" type="password" class="h-12 flex items-center" show-password-on="click" placeholder="请输入密码" />
        </NFormItem>

        <NSpace :vertical="true" :size="24">
          <NButton
            type="primary"
            size="large"
            :block="true"
            :loading="submitLoading"
            @click="handleSubmit"
          >
            确定
          </NButton>
          <div class="flex-y-center justify-between">
            <div class="w-12px">
              <NButton class="flex-1" :block="true" @click="toRegister">
                没有账户，去注册
              </NButton>
            </div>
          </div>
        </NSpace>
      </NForm>
    </div>
  </div>
</template>
