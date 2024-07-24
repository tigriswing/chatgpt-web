<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInst } from 'naive-ui'
import { NButton, NForm, NFormItem, NInput, NSpace, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import useSmsCode from '@/utils/functions'
import { verifySms } from '@/utils/request'
import generateRandom from '@/utils/functions/RandomUtils'
import { t } from '@/locales'
import { useAuthStoreWithout } from '@/store/modules'

defineProps<Props>()

const { label, isCounting, loading: smsLoading, getSmsCode } = useSmsCode()

const model = reactive({
  phone: '',
  code: '',
  pwd: '',
  confirmPwd: '',
})

interface Props {
  visible: boolean
}

const backgroundImageURL = '/login_bg.png'
const formRef = ref<HTMLElement & FormInst>()
let currentFlowId = ''

const message = useMessage()
const router = useRouter()
// 发送验证码
function handleSmsCode() {
  currentFlowId = generateRandom(16)

  getSmsCode(model.phone, currentFlowId)
}

const submitLoading = ref(false)
// 点击注册按钮
async function handleSubmit() {
  if (submitLoading.value)
    return
  await formRef.value?.validate()
  try {
    submitLoading.value = true
    const authStore = useAuthStoreWithout()

    const { data } = await verifySms(model.phone, model.pwd, model.code, currentFlowId)
    if (data !== undefined) {
      authStore.setDeviceId(data.deviceId)
      authStore.setUserId(data.userId)
      await router.push('/')
    }
    else { message.warning('验证码校验错误') }
  }
  catch (error: any) {
    const errorMessage = (error?.msg || error?.message) ?? t('common.wrong')
    message.warning(errorMessage)
  }
  finally {
    submitLoading.value = false
  }
}
const toLogin = async () => {
  await router.push('/login')
}
</script>

<template>
  <div class="h-full flex items-center justify-center bg-center bg-cover bg-no-repeat" :style="{ backgroundImage: `url(${backgroundImageURL})` }">
    <div class="w-full max-w-md p-4">
      <h2 class="text-white text-center pb-4 text-2xl font-mono font-bold">
        TERRA MOURS
      </h2>
      <NForm ref="formRef" :model="model" size="medium" label-placement="left">
        <NFormItem path="phone">
          <NInput v-model:value="model.phone" placeholder="请输入手机号" class="h-12 flex items-center" />
        </NFormItem>

        <NFormItem path="pwd">
          <NInput v-model:value="model.pwd" type="password" class="h-12 flex items-center" show-password-on="click" placeholder="请输入密码" />
        </NFormItem>

        <NFormItem path="code" class="flex items-center">
          <NInput v-model:value="model.code" placeholder="请输入验证码" class="mr-2 h-12 flex items-center">
            <template #prefix>
              <SvgIcon icon="ant-design:user-outlined" />
            </template>
          </NInput>
          <NButton size="large" :disabled="isCounting" type="primary" :loading="smsLoading" class="ml-2 h-12" @click="handleSmsCode">
            {{ label }}
          </NButton>
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
              <NButton class="flex-1" :block="true" @click="toLogin">
                返回
              </NButton>
            </div>
          </div>
        </NSpace>
      </NForm>
    </div>
  </div>
</template>
