import { action } from 'mobx'

import { Profile, RDBChat } from 'shared/interfaces'
import { store } from 'store'
import { subscribeToChatLiveMessages } from 'logic/liveMessage'
import { subscribeProfileOnlineStatusUpdates } from 'logic/onlineStatus'
import { subscribeToChatMessages } from 'logic/messages'
import { db } from 'services/db'
import { sentry } from 'services/sentry'
import { functions } from 'services/functions'

export const handleChatsAdded = action(
  ({ chats, profiles }: { chats: RDBChat[]; profiles: Profile[] }) => {
    if (store.me.profile === null) throw new Error('No my profile data in store')
    if (__DEV__) console.log(`Handle ${store.me.profile.username} chat added`, chats, profiles)

    store.profiles.setProfilesFromRdb(profiles)

    const storeChats = store.chats.setChatsFromRdb(chats)
    storeChats.forEach(chat => {
      subscribeToChatMessages(chat)
      subscribeToChatLiveMessages(chat)

      chat.companions.forEach(profile => subscribeProfileOnlineStatusUpdates(profile.id))
    })
  },
)

export const handleChatMembersAdded = action(
  ({ chatId, profiles }: { chatId: string; profiles: Profile[] }) => {
    const chat = store.chats.getChat(chatId)
    if (chat === undefined) return

    store.profiles.setProfilesFromRdb(profiles)

    profiles.forEach(profile => {
      chat.addCompanion(profile.id, true)
      subscribeProfileOnlineStatusUpdates(profile.id)
    })

    subscribeToChatLiveMessages(chat)
  },
)

export const updateChatLastReadTimestampRDB = async (chatId: string, timestamp: number) => {
  try {
    await db.updateReadChatTimestamp(store.me.id!, chatId, timestamp)
  } catch (e) {
    sentry.captureException(e)
  }
}

export const fetchChat = async (chatId: string) => {
  try {
    const { data } = await functions.fetchChat({ chatId })

    if (data.success) {
      handleChatsAdded({ chats: [data.payload.chat], profiles: data.payload.profiles })
    } else {
      sentry.captureException(new Error(data.errorMessage))
    }
  } catch (e) {
    sentry.captureException(e)
  }
}