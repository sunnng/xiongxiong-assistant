import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'node/prefer-global/process': 'off', // 关闭规则
  },
})
