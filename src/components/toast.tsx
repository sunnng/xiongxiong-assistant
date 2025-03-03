"use client";

import React from "react";
import { toast as sonnerToast } from "sonner";
import { CircleAlert, CircleCheck, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface ToastProps {
  id: string | number;
  title: string;
  description: string;
  button: {
    label: string;
    onClick: () => void;
  };
}

interface ToastStatusProps {
  id: string | number;
  description: string;
}

export function toast(options: Omit<ToastProps, "id">) {
  return sonnerToast.custom((id) => (
    <Toast
      id={id}
      title={options.title}
      description={options.description}
      button={options.button}
    />
  ));
}

export const toastError = (message: string) => {
  return sonnerToast.custom((id) => (
    <ToastError id={id} description={message} />
  ));
};

export const toastSuccess = (message: string) => {
  return sonnerToast.custom((id) => (
    <ToastSuccess id={id} description={message} />
  ));
};

function Toast(props: ToastProps) {
  const { title, description, button, id } = props;

  return (
    <div
      className={cn(
        "flex w-full md:max-w-[420px] md:w-[356px] items-center p-6 rounded-base shadow-shadow border-2 border-border bg-main text-mtext font-base ring-1 ring-black/5"
      )}
    >
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="text-sm font-bold text-text">{title}</p>
          <p className="mt-1 text-sm font-base">{description}</p>
        </div>
      </div>
      <div className="ml-5 shrink-0 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden">
        <button
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-base border-2 border-border dark:border-darkBorder bg-white px-3 text-sm font-base text-text ring-offset-white transition-colors disabled:pointer-events-none disabled:opacity-50"
          onClick={() => {
            button.onClick();
            sonnerToast.dismiss(id);
          }}
        >
          {button.label}
        </button>
      </div>

      <div className=""></div>
    </div>
  );
}

function ToastError(props: ToastStatusProps) {
  const { description, id } = props;

  return (
    <div className="relative flex w-full md:w-[356px] items-center gap-4 py-4 pl-6 pr-8 rounded-base shadow-shadow border-2 border-border bg-main text-mtext font-base ring-1 ring-black/5">
      <button
        className="absolute right-2 top-2 rounded-md p-1 text-text opacity-0 transition-opacity group-hover:opacity-100"
        onClick={() => {
          sonnerToast.dismiss(id);
        }}
      >
        <X className="h-4 w-4" />
      </button>

      <div className="w-full flex flex-col flex-1 items-start gap-1 min-w-0">
        <p className="text-sm font-bold text-text">操作失败</p>
        <p className="text-sm font-base w-full truncate">{description}</p>
      </div>
      <div className="inline-flex h-8 shrink-0 px-1 items-center justify-center text-sm font-base text-text ring-offset-white transition-colors disabled:pointer-events-none disabled:opacity-50">
        <CircleAlert />
      </div>
    </div>
  );
}

function ToastSuccess(props: ToastStatusProps) {
  const { description, id } = props;

  return (
    <div className="relative flex w-full md:w-[356px] items-center gap-4 py-4 pl-6 pr-8 rounded-base shadow-shadow border-2 border-border bg-main text-mtext font-base ring-1 ring-black/5">
      <button
        className="absolute right-2 top-2 rounded-md p-1 text-text opacity-0 transition-opacity group-hover:opacity-100"
        onClick={() => {
          sonnerToast.dismiss(id);
        }}
      >
        <X className="h-4 w-4" />
      </button>

      <div className="w-full flex flex-col flex-1 items-start gap-1 min-w-0">
        <p className="text-sm font-bold text-text">操作成功</p>
        <p className="text-sm font-base w-full truncate">{description}</p>
      </div>
      <div className="inline-flex h-8 shrink-0 px-1 items-center justify-center text-sm font-base text-text ring-offset-white transition-colors disabled:pointer-events-none disabled:opacity-50">
        <CircleCheck />
      </div>
    </div>
  );
}
