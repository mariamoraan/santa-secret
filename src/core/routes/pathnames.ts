export const PATHNAMES = {
    HOME_DEF: '/',
    GROUP_VIEW_DEF: '/happy-santa/:groupId/:userId?',
    GROUP_VIEW: (groupId: string, userId?: string) => `/happy-santa/${groupId}/${userId}`,
    CONFIG_DEF: '/config/:groupId',
    CONFIG: (groupId: string) => `/config/${groupId}`,
}