import { useQuery } from "@tanstack/react-query"
import { groupAPI } from "../../api/group.api"
import { QUERY_KEYS } from "../../../../core/tanstack/keys";

export const useGetGroupQuery = (groupId?: string) => {
   const { data, isLoading, error } = useQuery({
       queryKey: [QUERY_KEYS.GROUP, groupId],
       queryFn: () => groupAPI.getGroup(groupId ?? ''),
       enabled: !!groupId
   });
   return ({ group: data, isLoading, error });
}