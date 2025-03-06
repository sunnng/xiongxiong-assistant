'use client'

import type { GuildBattleRecord } from '@/features/guild/schemas'
import type { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<GuildBattleRecord>[] = [
  {
    accessorKey: 'username',
    header: '名称',
  },
  {
    accessorKey: 'combatPower',
    header: '战斗力',
  },
  {
    accessorKey: 'damage',
    header: '伤害',
    cell: ({ row }) => {
      const damage = row.getValue('damage')
      const formatted = (damage as number).toLocaleString()

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'bossType',
    header: 'BOSS',
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
