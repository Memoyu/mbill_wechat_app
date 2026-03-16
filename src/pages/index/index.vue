<script lang="ts" setup>
import { useToast } from 'wot-design-uni'

defineOptions({
  name: 'Home',
})
definePage({
  // 使用 type: "home" 属性设置首页，其他页面不需要设置，默认为page
  type: 'home',
  style: {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    navigationStyle: 'default',
    navigationBarTitleText: '首页',
  },
})

onLoad(() => {
  console.log('测试 uni API 自动引入: onLoad')
})

const { success: showSuccess } = useToast()

const model = reactive<{
  value1: string
  value2: string
}>({
  value1: '',
  value2: '',
})

const form = ref()

function handleSubmit() {
  form.value
    .validate()
    .then(({ valid, errors }) => {
      if (valid) {
        showSuccess({
          msg: '校验通过',
        })
      }
    })
    .catch((error) => {
      console.log(error, 'error')
    })
}
</script>

<template>
  <view class="px-4 pt-safe dark:bg-[var(--wot-dark-background2)]">
    <!-- <wd-form ref="form" :model="model">
      <wd-cell-group border>
        <wd-input
          v-model="model.value1"
          label="用户名"
          label-width="100px"
          prop="value1"
          clearable
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <wd-input
          v-model="model.value2"
          label="密码"
          label-width="100px"
          prop="value2"
          show-password
          clearable
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </wd-cell-group>
      <view class="footer">
        <wd-button type="primary" size="large" block @click="handleSubmit">
          提交
        </wd-button>
      </view>
    </wd-form> -->
    <view>dddd</view>
  </view>
</template>
