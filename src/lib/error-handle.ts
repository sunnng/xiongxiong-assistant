import { AppwriteException } from "node-appwrite";
import {
  ClientErrorStatusCode,
  ServerErrorStatusCode,
} from "hono/utils/http-status";

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

// 错误类型与用户提示的映射表
const APPWRITE_ERROR_MESSAGES: Record<string, string> = {
  // 请求限制类
  general_rate_limit_exceeded: "操作过于频繁，请稍后再试",
  rate_limit_exceeded: "系统繁忙，请稍后再试",

  // 资源不存在类
  storage_file_not_found: "请求的文件不存在",
  document_not_found: "找不到相关数据",
  collection_not_found: "数据集合不存在",

  /* 密码相关错误 (4xx) */
  user_password_mismatch: "密码与确认密码不一致，请重新输入",
  password_recently_used: "新密码与近期密码过于相似，请更换其他密码",
  password_personal_data: "密码包含个人信息（如姓名/电话），请更换更复杂的密码",

  /* 用户认证错误 (4xx) */
  user_phone_not_found: "账户未绑定手机号，请先验证手机",
  user_missing_id: "第三方登录信息不完整，请重新授权",
  user_jwt_invalid: "登录凭证已失效，请重新登录",
  user_invalid_token: "无效的验证令牌，请检查链接是否正确",
  user_email_not_whitelisted: "该邮箱不在白名单中，请联系管理员",
  user_ip_not_whitelisted: "当前IP不在许可范围内，请联系管理员",
  user_invalid_credentials: "账号或密码错误，请重新输入",
  user_session_already_exists: "已存在有效会话，请勿重复登录",

  /* 用户状态异常 (4xx) */
  user_blocked: "账户已被冻结，请联系客服",
  user_unauthorized: "操作未授权，请检查权限",
  user_password_reset_required: "需要重置密码后才能继续操作",

  /* 资源不存在 (404) */
  user_not_found: "用户不存在",
  user_session_not_found: "登录会话已过期，请重新登录",
  user_identity_not_found: "未找到第三方登录身份，请重新授权",
  team_not_found: "团队不存在",
  team_invite_not_found: "邀请链接已失效，请重新获取",

  /* 数据冲突 (409) */
  user_already_exists: "用户已存在（ID/邮箱/手机重复）",
  user_email_already_exists: "该邮箱已被注册",
  user_phone_already_exists: "该手机号已被注册",
  team_invite_already_exists: "已发送过邀请或用户已在团队中",
  team_already_exists: "团队ID已被占用，请更换其他ID",

  /* OAuth错误 (4xx/5xx) */
  user_oauth2_bad_request: "第三方登录请求异常，请重试",
  user_oauth2_unauthorized: "第三方登录授权失败",
  user_oauth2_provider_error: "第三方服务异常，请稍后重试",

  /* 系统限制 (5xx) */
  user_count_exceeded: "用户数量已达上限，请联系管理员",
  user_auth_method_unsupported: "当前登录方式不可用，请选择其他方式",

  /* 团队管理错误 */
  team_invalid_secret: "邀请密钥无效，请申请新邀请链接",
  team_invite_mismatch: "邀请信息不匹配，请检查账户是否正确",
  membership_already_confirmed: "团队成员关系已确认，无需重复操作",

  /* 默认错误 */
  default: "系统繁忙，请稍后再试",
  network_error: "网络连接异常，请检查网络后重试",
};

type ErrorHandlerOptions = {
  /**​ 自定义错误消息覆盖 */
  customMessages?: Record<string, string>;
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
  errorCode?: ClientErrorStatusCode | ServerErrorStatusCode;
} => {
  let isHandled = false;
  let userMessage = "操作失败，请稍后重试";
  let errorCode: ClientErrorStatusCode | ServerErrorStatusCode | undefined;

  // 1. 处理官方AppwriteException
  if (isAppwriteException(error)) {
    isHandled = true;
    errorCode = error.code as ClientErrorStatusCode | ServerErrorStatusCode;

    // 记录日志
    if (options.logDetails) {
      console.error("[Appwrite Error]", {
        code: error.code,
        type: error.type,
        response: error.response,
      });
    }

    // 合并自定义消息
    const messages = {
      ...APPWRITE_ERROR_MESSAGES,
      ...options.customMessages,
    };

    let userMessage = messages[error.type] || messages.default;

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
