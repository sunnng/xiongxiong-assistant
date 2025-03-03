import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFirstValidChar(str: string) {
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (/[\u4e00-\u9fa5]/.test(char)) {
      // 中文字符
      return char;
    } else if (/[a-zA-Z]/.test(char)) {
      // 英文字母
      return char.toUpperCase();
    } else if (/[0-9]/.test(char)) {
      // 数字
      return char;
    }
    // 特殊符号继续循环，直到找到有效字符
  }
  return "熊"; // 字符串全为特殊符号或无有效字符
}
