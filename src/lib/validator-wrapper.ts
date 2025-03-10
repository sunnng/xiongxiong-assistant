import type { ValidationTargets } from 'hono'
import type { ZodSchema } from 'zod'
import { zValidator as zv } from '@hono/zod-validator'

export function zValidator<
  T extends ZodSchema,
  Target extends keyof ValidationTargets,
>(target: Target, schema: T) {
  return zv(target, schema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          message: '表单数据有误，请校验后重试。',
        },
        400,
      )
    }
  })
}
