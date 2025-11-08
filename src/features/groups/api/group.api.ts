import { doc, getDoc, setDoc } from "firebase/firestore";
import { uuid } from "../../../core/uuid/uuid"
import { db } from "../../../core/firebase";
import { Group, Participant, type GroupDTO } from "../domain/group";

export const groupAPI = {
    createGroup: async(owner: Participant): Promise<string> => {
        const id = uuid();
        const ref = doc(db, "groups", id);
        const group = new Group({
            id,
            participants: [owner],
            pairings: {}
        })
        const groupDTO = group.toDTO();
        await setDoc(ref, { ...groupDTO });
        return id;
    },
    updateGroup: async(group: Group): Promise<void> => {
        const ref = doc(db, "groups", group.id);
        const groupDTO = group.toDTO();
         console.log("Updating group:", groupDTO);
        await setDoc(ref, { ...groupDTO });
    },
    getGroup: async(groupId: string): Promise<Group | null> => {
        const ref = doc(db, "groups", groupId);
        const snap = await getDoc(ref);
        return snap.exists() ? Group.fromDTO(snap.data() as GroupDTO) : null;
    }
}