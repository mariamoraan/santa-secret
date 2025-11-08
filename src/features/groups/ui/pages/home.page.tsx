import SantaImage from '@/assets/santa.png'
import styles from './home.module.scss'
import { bind } from '../../../../core/styles/bind'
import {  useEffect, useState } from 'react'
import { useCreateGroupCommand } from '../../use-cases/commands/use-create-group.command'
import { Button } from '../../../../core/components/button/button'
import { useNavigate } from 'react-router-dom'
import { PATHNAMES } from '../../../../core/routes/pathnames'
import { uuid } from '../../../../core/uuid/uuid'
import { Participant } from '../../domain/group'
import { STORAGE_KEYS } from '../../storage-keys'
const cn = bind(styles)

export const HomePage = () => {
    const navigate = useNavigate();
    const { createGroup, isPending } = useCreateGroupCommand();
    const [ownerName, setOwnerName] = useState<string>("");
    const storedGroupId = localStorage.getItem(STORAGE_KEYS.GROUP_ID);
    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        const ownerUID = uuid();
        const owner = new Participant({ id: ownerUID, name: ownerName, isOwner: true });
        const groupId = await createGroup(owner);
        localStorage.setItem(STORAGE_KEYS.GROUP_ID, groupId);
        setOwnerName("");
        navigate(PATHNAMES.CONFIG(groupId));
        localStorage.setItem(STORAGE_KEYS.USER_ID, owner.id);
    }

    useEffect(() => {
        if(!storedGroupId) return;
        navigate(PATHNAMES.CONFIG(storedGroupId));
    }, [storedGroupId])

    return (
        <div className={cn('home-page')}>
            <h1 className={cn('home-page__title')}>Amigo Invisible</h1>
            <img className={cn('home-page__image')} src={SantaImage} alt="Santa" />
            <h2 className={cn('home-page__subtitle')}>Comparte un regalo <br /> Haz una sorpresa</h2>
            <p className={cn('home-page__description')}>Crea fácilmente tu evento de amigo invisible e invita a tus amigos</p>
            <form className={cn('home-page__form')} onSubmit={handleSubmit}>
                <label className={cn('home-page__form__label')} htmlFor="name">Ingresa tu nombre para comenzar</label>
                <input 
                className={cn('home-page__form__input')} 
                type="name" id="name" value={ownerName} 
                onChange={(e) => setOwnerName(e.target.value)} 
                />
                <Button 
                className={cn('home-page__form__button')} 
                type="submit"
                disabled={!ownerName}
                isLoading={isPending}
                >
                    Continue
                </Button>
            </form>
        </div>
    )
}