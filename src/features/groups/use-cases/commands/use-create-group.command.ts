import { useMutation } from "@tanstack/react-query"
import { groupAPI } from "../../api/group.api"

export const useCreateGroupCommand = () => {
    const { mutateAsync, isPending, isError } = useMutation({
        mutationFn: groupAPI.createGroup
    });
    return { createGroup: mutateAsync, isPending, isError }
}