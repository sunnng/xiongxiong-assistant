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
  const query = useQuery({
    queryKey: ['battle-records'],
  })
}
