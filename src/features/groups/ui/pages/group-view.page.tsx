import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetGroupQuery } from "../../use-cases/queries/use-get-group.query";
import SantaImage from '@/assets/santa.png'
import styles from "./group-view.module.scss";
import { bind } from "../../../../core/styles/bind";
import { PATHNAMES } from "../../../../core/routes/pathnames";
import { useEffect } from "react";
import { STORAGE_KEYS } from "../../storage-keys";
import { Button } from "../../../../core/components/button/button";
import { toast } from 'react-toastify';
const cn = bind(styles);

const calcTimeToDate = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    return { days, hours, minutes };
}

export const GroupViewPage = () => {
    const { groupId, userId } = useParams();
    const navigate = useNavigate();
    const { group, isLoading } = useGetGroupQuery(groupId);
    const storedUserId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    const timeToEvent = group?.date ? calcTimeToDate(group.date) : null;
    const currentUser = group?.participants?.find(participant => participant.id === userId);
    const secretSantaID =  currentUser?.id ? group?.pairings?.[currentUser?.id] : null;
    const secretSanta = group?.participants?.find(participant => participant.id === secretSantaID);

    useEffect(() => {
        if(!storedUserId || !groupId) return;
        navigate(PATHNAMES.GROUP_VIEW(groupId, storedUserId));
    }, [group, storedUserId])

    useEffect(() => {
        if(!group?.id || !currentUser?.id) return;
        localStorage.setItem(STORAGE_KEYS.GROUP_ID, group.id);
        localStorage.setItem(STORAGE_KEYS.USER_ID, currentUser.id);
    }, [currentUser, group])

    if (isLoading) return <p>Loading...</p>

    const buildShareLink = () => `http://localhost:5173/happy-santa/${group?.id}`;


    return (
        <div className={cn('group-view-page')}>
            <h1 className={cn('group-view-page__title')}>{group?.name}</h1>
            <img className={cn('group-view-page__image')} src={SantaImage} alt="Santa" />
            <div>
                <h2 className={cn('group-view-page__subtitle')}>Ho-ho-ho! </h2>
                {currentUser ? (
                    <h2 className={cn('group-view-page__subtitle', 'group-view-page__subtitle__name')}>{currentUser?.name}</h2>
                ) : null}
                <h2 className={cn('group-view-page__subtitle')}>¡Estás invitado!</h2>
            </div>
            <div  className={cn('group-view-page__event-card')}>
                <h3 className={cn('group-view-page__event-card__event-name')}>{group?.name ?? "Amigo Invisible 2025"}</h3>
                <p className={cn('group-view-page__event-card__countdown')}>
                    <div className={cn('group-view-page__event-card__countdown__item')}>
                        <p className={cn('group-view-page__event-card__countdown__item__value')}>{timeToEvent?.days}</p>
                        <p className={cn('group-view-page__event-card__countdown__item__label')}>Días</p>
                    </div>
                    <div className={cn('group-view-page__event-card__countdown__item')}>
                        <p className={cn('group-view-page__event-card__countdown__item__value')}>{timeToEvent?.hours}</p>
                        <p className={cn('group-view-page__event-card__countdown__item__label')}>Horas</p>
                    </div>
                    <div className={cn('group-view-page__event-card__countdown__item')}>
                        <p className={cn('group-view-page__event-card__countdown__item__value')}>{timeToEvent?.minutes}</p>
                        <p className={cn('group-view-page__event-card__countdown__item__label')}>Mins</p>
                    </div>
                </p>
            </div>
            {
            currentUser 
                ? (
                    <div className={cn("group-view-page__secret-santa")}>
                        <p className={cn("group-view-page__secret-santa__label")}>Tu Amigo Invisible Es:</p>
                        <p className={cn("group-view-page__secret-santa__name")}>{secretSanta?.name}</p>
                    </div>
                )
                : (
                    <div className={cn('group-view-page__participants')}>
                     <p className={cn('group-view-page__participants__description')}>Selecciona tu nombre y ve tu Amigo Invisible</p>
                     <ul className={cn('group-view-page__participants__participants-list')}>
                        {
                            group?.participants?.map(participant => (
                                <li key={participant.id} className={cn('group-view-page__participants__participants-list__item')}>
                                    <Link
                                        className={cn('group-view-page__participants__participants-list__item__link')}
                                        to={PATHNAMES.GROUP_VIEW(group.id, participant.id)}
                                        onClick={() => {
                                            localStorage.setItem(STORAGE_KEYS.USER_ID, participant.id);
                                        }}
                                    >
                                        {participant.name}
                                    </Link>
                                </li>
                            ))
                        }
                     </ul>
                    </div>
                )
            }

            {currentUser?.isOwner && (
                <Button
                className={cn('group-view-page__share-button')}
                onClick={() => {
                    navigator.clipboard.writeText(buildShareLink());
                    toast("Link copied to clipboard!");
                }}
                >
                    Copiar enlace de invitación
                </Button>
            )  }

            <div className={cn('group-view-page__create-new-event')}>
                <Button 
                isText
                onClick={() => {
                    localStorage.removeItem(STORAGE_KEYS.USER_ID);
                    localStorage.removeItem(STORAGE_KEYS.GROUP_ID);
                    navigate(PATHNAMES.HOME_DEF);
                }}
                className={cn('group-view-page__create-new-event__action')}
                >
                    Crea tu Amigo Invisible
                </Button>
                <p className={cn('group-view-page__create-new-event__warning')}>
                    Recuerda guardar tu link para no perder tu evento !
                </p>
            </div>
        </div>
    );
};
