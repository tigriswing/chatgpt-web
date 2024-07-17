<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInst } from 'naive-ui'
import { NButton, NForm, NFormItem, NInput, NSpace, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import useSmsCode from '@/utils/functions'
import { login } from '@/utils/request'
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

const message = useMessage()
const router = useRouter()
// 发送验证码
function handleSmsCode() {
  getSmsCode(model.phone)
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
    const data = await login()
    if (data.code === '0000') {
      authStore.setToken(data.data.userId)
      await router.push('/')
    }

    // const data = await fetchRegister(model.email, model.pwd, model.confirmPwd, model.code)
    // if (data.code === 200) {
    //  message.success(data.data)
    //  await router.push('/login')
    // }
    // else {
    //  message.warning('注册失败!')
    // }
  }
  catch (error: any) {
    message.warning(error.message ?? 'error')
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
  <div class="h-full relative bg-center bg-cover bg-no-repeat" :style="{ backgroundImage: `url(${backgroundImageURL})` }">
    <div class="absolute w-1/4 p-4 right-40 bottom-1/2 translate-y-1/2">
      <h2 class="text-white text-center pb-4 text-2xl font-mono font-bold">
        TERRA MOURS
      </h2>
      <NForm ref="formRef" :model="model" size="medium" label-placement="left">
        <NFormItem path="phone">
          <NInput v-model:value="model.phone" placeholder="请输入手机号" />
        </NFormItem>

        <NFormItem path="pwd">
          <NInput v-model:value="model.pwd" type="password" show-password-on="click" placeholder="请输入密码" />
        </NFormItem>

        <NFormItem path="code">
          <NInput v-model:value="model.code" placeholder="请输入验证码">
            <template #prefix>
              <SvgIcon icon="ant-design:user-outlined" />
            </template>
          </NInput>
          <NButton size="large" :disabled="isCounting" type="primary" :loading="smsLoading" @click="handleSmsCode">
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
