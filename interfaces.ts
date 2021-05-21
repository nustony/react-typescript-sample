export interface RDBProfile {
  id: string
  firstName?: string
  lastName?: string
  username: string
  phone: string
  pushToken?: string
  blocked?: { [profileId: string]: true }
}

interface ClientProfileProps {
  online?: boolean
  activeChat?: string | null
  activity?: OnlineActivity
}

export type Profile = Omit<RDBProfile, 'phone' | 'pushToken' | 'blocked'> & ClientProfileProps

export type OwnProfile = RDBProfile & ClientProfileProps