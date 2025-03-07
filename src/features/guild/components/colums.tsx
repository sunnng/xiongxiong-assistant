'use client'

import type { GuildBattleRecord } from '@/features/guild/schemas'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'

export const columns: ColumnDef<GuildBattleRecord>[] = [
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="font-bold -ml-3 h-8 px-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        玩家名称
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'combatPower',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="战斗力" />
    ),
  },
  {
    accessorKey: 'damage',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          伤害
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const damage = row.getValue('damage')
      const formatted = (damage as number).toLocaleString()

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'bossType',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          BOSS
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'bossStartStage',
    header: '开始阶段',
  },
  {
    accessorKey: 'bossEndStage',
    header: '结束阶段',
  },
  {
    accessorKey: 'joinTime',
    header: '讨伐时间',
  },
  {
    accessorKey: 'seasonName',
    header: '赛季',
  },
  {
    accessorKey: 'guildName',
    header: '公会',
  },

]
