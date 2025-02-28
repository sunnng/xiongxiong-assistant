import { z } from "zod";

// 密码熵计算函数
const calculatePasswordEntropy = (password: string) => {
  // 定义更广泛的字符集（包含更多特殊符号）
  const charCategories = [
    { regex: /[a-z]/, size: 26 }, // 小写字母
    { regex: /[A-Z]/, size: 26 }, // 大写字母
    { regex: /[0-9]/, size: 10 }, // 数字
    { regex: /[!@#$%^&*()_+{}[\]:;<>?,./-]/, size: 30 }, // 扩展特殊符号
  ];

  // 计算实际使用的字符集大小
  const charsetSize = charCategories.reduce(
    (sum, { regex, size }) => (regex.test(password) ? sum + size : sum),
    0
  );

  // 熵值公式：E = L * log2(N)
  return password.length * Math.log2(charsetSize || 1);
};

// 共用邮箱验证
const emailSchema = z
  .string()
  .min(1, "邮箱不能为空")
  .email("无效的邮箱格式")
  .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "包含无效字符");

export const signUpSchema = z.object({
  name: z
    .string()
    .min(1, "用户名不能为空")
    .min(3, "用户名至少3个字符")
    .max(20, "用户名最长20个字符")
    .regex(/^[a-zA-Z0-9_\-\.]+$/, "仅允许字母、数字、下划线和连字符") // 禁止特殊符号
    .regex(/^\S*$/, "不能包含空格") // 禁止空格
    .transform((str) => str.trim()), // 自动去除首尾空格

  email: emailSchema,

  password: z
    .string()
    .min(1, "密码不能为空")
    .min(8, "密码至少需要8个字符") // 修改为8字符
    .max(64, "密码最长64个字符")
    .regex(/(?=.*[a-z])/, "必须包含小写字母")
    .regex(/(?=.*[A-Z])/, "必须包含大写字母")
    .regex(/(?=.*[0-9])/, "必须包含数字")
    .regex(/(?=.*[!@#$%^&*()_+{}[\]:;<>?,./-])/, "必须包含特殊符号")
    .refine((password) => calculatePasswordEntropy(password) >= 60, {
      message: "密码强度不足",
      params: {
        tips: [
          "8字符密码需满足：",
          "- 必须包含大小写字母 + 数字 + 特殊符号",
          "- 示例：P@ssw0rd!",
        ],
      },
    }),
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "密码不能为空").max(64, "密码过长"), // 可选：防止超长输入攻击
});

// 类型推导
export type SignInFormData = z.infer<typeof SignInSchema>;
