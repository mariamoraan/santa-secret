export interface GroupDTO {
    id: string;
    participants?: ParticipantDTO[];
    pairings?: Record<string, string>;
    date?: string;
    name?: string;
}

export interface ParticipantDTO {
    id: string;
    name: string;
    isOwner?: boolean;
}

export class Participant {
    public id: string;
    public name: string;
    public isOwner?: boolean;

    constructor({
        id,
        name,
        isOwner
    }: {
        id: string,
        name: string,
        isOwner?: boolean
    }) {
        this.id = id;
        this.name = name;
        this.isOwner = isOwner;
    }

    static fromDTO(dto: ParticipantDTO): Participant {
        return new Participant({
            id: dto.id,
            name: dto.name,
            isOwner: dto?.isOwner
        });
    }

    toDTO(): ParticipantDTO {
        return {
            id: this.id,
            name: this.name,
            isOwner: this?.isOwner ? true : false
        };
    }
}
export class Group {
    public id: string;
    public participants?: Participant[];
    public pairings?: Record<string, string>;
    public date?: Date;
    public name?: string;

    constructor({
        id,
        participants,
        pairings,
        date,
        name,
    }: {
        id: string, 
        participants?: Participant[], 
        pairings?: Record<string, string>,
        date?: Date,
        name?: string
    }) {
        this.id = id;
        this.participants = participants;
        this.pairings = pairings;
        this.date = date;
        this.name = name;
    }

    static fromDTO(dto: GroupDTO): Group {
        const participants = dto?.participants?.map(p => Participant.fromDTO(p));
        return new Group({
            id: dto.id,
            participants,
            pairings: dto?.pairings,
            date: dto?.date ? new Date(dto.date) : undefined,
            name: dto?.name
        });
    }

    toDTO(): GroupDTO {
        return {
            id: this.id,
            participants: this?.participants?.map(p => p.toDTO()) ?? [],
            date: this?.date ? this.date.toISOString() : '',
            pairings: this?.pairings ?? {},
            name: this?.name ?? '',
        };
    }

    makePairings(): void {
        if(!this?.participants?.length) {
            this.pairings = {};
            return;
        }
        const shuffled = this?.participants
            ?.map(value => ({ value, sort: Math.random() }))
            ?.sort((a, b) => a.sort - b.sort)
            ?.map(({ value }) => value);

        this.pairings = {};
        for (let i = 0; i < shuffled.length; i++) {
            const giver = shuffled[i];
            const receiver = shuffled[(i + 1) % shuffled.length];
            this.pairings[giver.id] = receiver.id;
        }
    }
}           