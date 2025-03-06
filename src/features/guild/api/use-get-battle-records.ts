import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'

interface UseGetBattleRecordsProps {
  guildName?: string | null
  seasonName?: string | null
  username?: string | null
}

export function useGetBattleRecords({
  guildName,
  seasonName,
  username,
}: UseGetBattleRecordsProps) {
  return useQuery({
    queryKey: ['battle-records'],
    queryFn: async () => {
      const response = await client.api.guild.battle.records.$get({ query:
          { guildName: guildName ?? undefined, seasonName: seasonName ?? undefined, username: username ?? undefined } })

      if (!response.ok) {
        return null
      }

      const { data } = await response.json()

      return data
    },
  })
}
