'use client'

import type { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { bossTypes } from './data'

import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="输入玩家名称"
          value={(table.getColumn('username')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('username')?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('bossType') && (
          <DataTableFacetedFilter
            column={table.getColumn('bossType')}
            title="BOSS"
            options={bossTypes}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            重置
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
