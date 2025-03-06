'use client'

import { useGetBattleRecords } from '@/features/guild/api/use-get-battle-records'

import { columns } from '@/features/guild/components/colums'
import { DataTable } from '@/features/guild/components/data-table'

export function GuildBattleRecordsCard() {
  const { data } = useGetBattleRecords({})

  return (
    <div>
      <DataTable columns={columns} data={data?.documents ?? []} />
    </div>
  )
}
