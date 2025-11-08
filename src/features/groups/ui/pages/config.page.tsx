import { useNavigate, useParams } from "react-router-dom";
import { useGetGroupQuery } from "../../use-cases/queries/use-get-group.query";
import styles from './config.module.scss'
import { bind } from "../../../../core/styles/bind";
import { useEffect, useState } from "react";
import { Button } from "../../../../core/components/button/button";
import { Group, Participant } from "../../domain/group";
import { useUpdateGroupCommand } from "../../use-cases/commands/use-update-group.command";
import { PlusIcon } from "../../../../core/icons";
import { PATHNAMES } from "../../../../core/routes/pathnames";
import { STORAGE_KEYS } from "../../storage-keys";
const cn = bind(styles)

const MONTHS_OPTIONS = [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
];

export const ConfigPage = () => {
    const { groupId } = useParams();
    const storedUserId = localStorage.getItem(STORAGE_KEYS.USER_ID) || '';
    const navigate = useNavigate();
    const { group, isLoading } = useGetGroupQuery(groupId);
    const { updateGroup , isPending } = useUpdateGroupCommand();
    const owner = group?.participants?.find(p => p.isOwner);
    const ownerName = owner?.name ?? '';
    const [newParticipantName, setNewParticipantName] = useState('');
    const [eventConfig, setEventConfig] = useState<{
        name: string,
        date: {
            day: string,
            month: string,
            year: string
            hour: string,
            minute: string
        },
        participants: Array<{ id: string, name: string }>
    }>({
        name: '',
        date: {
            day: '25',
            month: '12',
            year: new Date().getFullYear().toString(),
            hour: '21',
            minute: '00'
        },
        participants: group?.participants || []
    })

    const addParticipant = (name: string) => {
        const newParticipant = {
            id: crypto.randomUUID(),
            name
        };
        setEventConfig({
            ...eventConfig,
            participants: [...eventConfig.participants, newParticipant]
        });
        setNewParticipantName('');
    }

    const handleConfigSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if(!group) return;
        const eventDate = new Date(
            Number(eventConfig.date.year), 
            Number(eventConfig.date.month) - 1, 
            Number(eventConfig.date.day),
            Number(eventConfig.date.hour),
            Number(eventConfig.date.minute)
        );
        const updatedGroup =  new Group({
            id: group.id,
            name: eventConfig.name,
            date: eventDate,
            participants: eventConfig?.participants?.map(participant => new Participant({
                id: participant.id,
                name: participant.name,
                isOwner: participant.id === owner?.id
            })) || [],
            pairings: {}
        })
        updatedGroup.makePairings();
        await updateGroup(updatedGroup);
        navigate(PATHNAMES.GROUP_VIEW(group.id, storedUserId));

    }

    useEffect(() => {
        if(!group) return;
        if(group?.name) navigate(PATHNAMES.GROUP_VIEW(group.id, storedUserId));
        setEventConfig({
            name: group?.name ?? '',
            date: {
                day: group?.date ? group?.date.getDate().toString().padStart(2, '0') : '25',
                month: group?.date ? (group?.date.getMonth() + 1).toString().padStart(2, '0') : '12',
                year: group?.date ? group?.date.getFullYear().toString() : new Date().getFullYear().toString(),
                hour: group?.date ? group?.date.getHours().toString().padStart(2, '0') : '21',
                minute: group?.date ? group?.date.getMinutes().toString().padStart(2, '0') : '00'
            },
            participants: group?.participants ?? []
        })
    }, [group]);

    if (isLoading) return <p>Loading...</p>

    return (
        <div className={cn('participants-page')}>
            <h1 className={cn('participants-page__title')}>Ho-ho-ho !</h1>
            <h2 className={cn('participants-page__subtitle')}>Vamos a configurar tu evento, {ownerName}</h2>

            <form 
            className={cn('participants-page__form')}
            onSubmit={handleConfigSubmit}
            >
                <label className={cn('participants-page__form__label')} htmlFor="event-name">Nombre</label>
                <input 
                    className={cn('participants-page__form__input')} 
                    type="text" 
                    id="event-name" 
                    placeholder="e.j Navidades 2025" 
                    value={eventConfig.name}
                    onChange={e => setEventConfig({ ...eventConfig, name: e.target.value })}
                />

                <fieldset 
                    className={cn('participants-page__form__fieldset')} 
                >
                   <legend className={cn('participants-page__form__fieldset__legend')}>Fecha del Evento</legend>
                    <div className={cn('participants-page__form__fieldset__date-group')}>
                        <div>
                        <input 
                            className={cn(
                                'participants-page__form__fieldset__date-group__input',
                                'participants-page__form__fieldset__date-group__input--day'
                            )} 
                            id="day" 
                            value={eventConfig.date.day}
                            onChange={e => setEventConfig({ ...eventConfig, date: { ...eventConfig.date, day: e.target.value } })}
                        />
                        <select 
                            className={cn(
                                'participants-page__form__fieldset__date-group__select',
                                'participants-page__form__fieldset__date-group__select--month'
                            )} 
                            id="month"
                            value={eventConfig.date.month}
                            onChange={e => setEventConfig({ ...eventConfig, date: { ...eventConfig.date, month: e.target.value } })}
                        >
                            {MONTHS_OPTIONS.map(month => (
                                <option 
                                    key={month.value} 
                                    value={month.value}
                                    selected={eventConfig.date.month === month.value}
                                >
                                    {month.label}
                                </option>
                            ))}
                        </select>
                        <input 
                            className={cn(
                                'participants-page__form__fieldset__date-group__input',
                                'participants-page__form__fieldset__date-group__input--year'
                            )} 
                            id="year" 
                            value={eventConfig.date.year}
                            onChange={e => setEventConfig({ ...eventConfig, date: { ...eventConfig.date, year: e.target.value } })}
                        />
                        </div>
                        <div>
                            <input 
                                className={cn(
                                    'participants-page__form__fieldset__date-group__input',
                                    'participants-page__form__fieldset__date-group__input--hour'
                                )} 
                                id="hour"
                                value={eventConfig.date.hour}       
                                onChange={e => setEventConfig({ ...eventConfig, date: { ...eventConfig.date, hour: e.target.value } })}
                            />
                            <span>:</span>
                            <input 
                                className={cn(
                                    'participants-page__form__fieldset__date-group__input',
                                    'participants-page__form__fieldset__date-group__input--minute'
                                )} 
                                id="minute" 
                                value={eventConfig.date.minute}
                                onChange={e => setEventConfig({ ...eventConfig, date: { ...eventConfig.date, minute: e.target.value } })}
                            />  
                        </div>
                    </div>
                  </fieldset>
                    <label className={cn('participants-page__form__label')} htmlFor="event-name">
                    ¿Quién estará en el evento?
                    </label>
                    <div className={cn('participants-page__form__input-wrapper')}>
                        <input 
                            className={cn('participants-page__form__input', 'participants-page__form__input--no-border')} 
                            type="text" 
                            id="event-name" 
                            placeholder="Elena" 
                            value={newParticipantName}
                            onChange={e => setNewParticipantName(e.target.value)}
                        />
                        <Button 
                            className={cn('participants-page__form__input-button')} 
                            type="button"
                            isIcon
                            isText
                            onClick={() => addParticipant(newParticipantName)}
                        >
                                <PlusIcon />
                        </Button>
                    </div>
                     <ul  className={cn('participants-page__form__participants-list')}>
                        {eventConfig?.participants?.map(participant => (
                            <li className={cn('participants-page__form__participants-list__item')} key={participant.id}>
                                {participant.name}
                            </li>
                        ))}
                    </ul>

                <Button 
                className={cn('participants-page__form__button')} 
                type="submit"
                disabled={!eventConfig?.name || eventConfig?.participants?.length < 2}
                isLoading={isPending}
                >
                    Crear Evento
                </Button>
            </form>
        </div>
    )
}