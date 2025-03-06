// components/dynamic-breadcrumb.tsx
'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { usePathname } from 'next/navigation'

import { Fragment } from 'react'

// 路由配置类型
interface RouteConfig {
  displayName: string
  parentPath?: string
  dynamicPattern?: RegExp // 用于匹配动态路由
}

// 路由配置中心（可扩展）
const routeConfig: Record<string, RouteConfig> = {
  '/': {
    displayName: '首页',
    parentPath: undefined,
  },
  '/guild': {
    displayName: '公会首页',
    parentPath: undefined,
  },
  '/guild/battle': {
    displayName: '公会讨伐战',
    parentPath: '/guild',
  },
  '/guild/battle/[id]': {
    displayName: '公会讨伐战',
    parentPath: '/guild/battle',
    dynamicPattern: /^\/guild\/battle\/[^/]+$/,
  },
}

// 路径规范化工具
function normalizePath(rawPath: string): string {
  // 处理动态路由
  const dynamicRoute = Object.keys(routeConfig).find((key) => {
    const pattern = routeConfig[key]?.dynamicPattern
    return pattern?.test(rawPath)
  })

  return dynamicRoute || rawPath
}

export function DynamicBreadcrumbs() {
  const pathname = usePathname()
  const normalizedPath = normalizePath(pathname)

  // 递归获取面包屑链
  const getBreadcrumbChain = (): Array<{ path: string, name: string }> => {
    const chain = []
    let currentPath = normalizedPath
    const visited = new Set<string>()

    while (currentPath && !visited.has(currentPath)) {
      visited.add(currentPath)
      const config = routeConfig[currentPath]

      if (config) {
        chain.unshift({
          path: currentPath,
          name: config.displayName,
        })
        currentPath = config.parentPath || ''
      }
      else {
        // 处理未配置的路径段
        const segments = currentPath.split('/').filter(Boolean)
        const lastSegment = segments.pop() || ''
        chain.unshift({
          path: currentPath,
          name: lastSegment.replace(/-/g, ' '),
        })
        currentPath = segments.join('/') || '/'
      }
    }

    return chain
  }

  const breadcrumbItems = getBreadcrumbChain()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <Fragment key={item.path}>
            {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
            <BreadcrumbItem>
              {index === breadcrumbItems.length - 1
                ? (
                    <BreadcrumbPage className="font-medium">
                      {item.name}
                    </BreadcrumbPage>
                  )
                : (
                    <BreadcrumbLink className="hidden md:block" href={item.path}>
                      {item.name}
                    </BreadcrumbLink>
                  )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
