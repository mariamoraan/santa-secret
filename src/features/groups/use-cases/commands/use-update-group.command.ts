import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupAPI } from "../../api/group.api";
import { QUERY_KEYS } from "../../../../core/tanstack/keys";

export const useUpdateGroupCommand = () => {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending, isError } = useMutation({
        mutationFn: groupAPI.updateGroup,
        onSuccess: (_, group) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GROUP, group.id] });
        }
    });
    return { updateGroup: mutateAsync, isPending, isError }
}