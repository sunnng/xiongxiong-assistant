import { AppwriteException } from "node-appwrite";

/**
 * 类型守卫 - 精确判断是否为 AppwriteException
 * @param error 任意输入对象
 * @returns 是否是合法的 AppwriteException
 */
export function isAppwriteException(
  error: unknown
): error is AppwriteException {
  // 基础对象检查
  if (typeof error !== "object" || error === null) return false;

  // 原型链快速验证（优先检查）
  if (error instanceof AppwriteException) return true;

  // 结构类型深度验证（兜底检查）
  return (
    // 必需属性存在性检查
    "code" in error &&
    "response" in error &&
    "type" in error &&
    "message" in error && // 来自 Error 基类
    "name" in error && // 来自 Error 基类
    // 属性类型精确验证
    typeof error.code === "number" &&
    typeof error.response === "string" &&
    typeof error.type === "string" &&
    typeof error.message === "string" &&
    typeof error.name === "string" &&
    // 可选：验证 Error 特征属性
    ("stack" in error ? typeof error.stack === "string" : true) &&
    // 可选：验证构造函数特征（防御篡改）
    (error.constructor.name === "AppwriteException" ||
      error.constructor === AppwriteException)
  );
}

type ErrorHandlerOptions = {
  logDetails?: boolean; // 是否记录详细错误
  onUnauthorized?: () => void; // 401处理回调
};

/**
 * 处理Appwrite错误的函数
 * @param error 捕获的错误对象
 * @param options 配置项
 */
export const handleAppwriteError = (
  error: unknown,
  options: ErrorHandlerOptions = {}
): {
  isHandled: boolean;
  userMessage: string;
  errorCode?: number;
} => {
  let isHandled = false;
  let userMessage = "操作失败，请稍后重试";
  let errorCode: number | undefined;

  // 1. 处理官方AppwriteException
  if (isAppwriteException(error)) {
    isHandled = true;
    errorCode = error.code;

    // 记录日志
    if (options.logDetails) {
      console.error("[Appwrite Error]", {
        code: error.code,
        type: error.type,
        response: error.response,
      });
    }

    // 按状态码分类处理
    switch (error.code) {
      case 401:
        userMessage = "登录已过期，请重新登录";
        options.onUnauthorized?.();
        break;
      case 429:
        userMessage = "操作过于频繁，请稍后再试";
        break;
      case 500:
        userMessage = "服务器内部错误";
        break;
      default:
        userMessage = `请求失败（错误码：${error.code}）`;
    }

    return { isHandled, userMessage, errorCode };
  }

  // 2. 处理其他Error类型
  if (error instanceof Error) {
    console.error("[System Error]", error.message);
    return {
      isHandled: false,
      userMessage: `系统异常：${error.message.slice(0, 50)}`,
    };
  }

  // 3. 未知错误类型
  console.error("[Unknown Error]", error);
  return { isHandled: false, userMessage };
};
