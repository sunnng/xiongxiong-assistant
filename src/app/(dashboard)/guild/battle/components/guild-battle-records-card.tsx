'use client'

import { DataTable } from '@/components/data-table/data-table'
import { useGetBattleRecords } from '@/features/guild/api/use-get-battle-records'

import { columns } from '@/features/guild/components/colums'

export function GuildBattleRecordsCard() {
  const { data } = useGetBattleRecords({})

  return (
    <div>
      <DataTable columns={columns} data={data?.documents ?? []} />
    </div>
  )
}
