import React, { FC } from 'react'
import { Image, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import { observer } from 'mobx-react'

import { navigation } from 'services/navigation'
import {
  BLACK,
  deviceWidth,
  fontAvenirBold,
  globalStyles,
  mediumHitSlop,
  statusBarHeight,
} from 'globalStyles'
import { chevronLeftIcon } from 'assets'
import { store } from 'store'

interface Props {
  backButton?: boolean
  backAction?: () => void
  title?: string
  left?: JSX.Element | boolean
  right?: JSX.Element
  slim?: boolean
}
export const Header: FC<Props> = observer(function Header({
  backButton = true,
  backAction,
  title,
  left,
  right,
  slim,
}) {
  return (
    <View style={getContainerStyle(store.noInternet, slim)} pointerEvents="box-none">
      {backButton && (
        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={mediumHitSlop}
          onPress={backAction ?? navigation.goBack}
          testID="HEADER_BACK_BUTTON"
        >
          <Image source={chevronLeftIcon} style={styles.backIcon} />
        </TouchableOpacity>
      )}

      {left}

      {title != null ? (
        <Text style={styles.titleFlexed}>{title}</Text>
      ) : (
        <View style={globalStyles.flexOne} />
      )}

      {right}
    </View>
  )
})

const titleStyle: TextStyle = { paddingRight: 10, ...fontAvenirBold(20), color: BLACK }

const HEADER_HEIGHT = 54
const HEADER_HEIGHT_SLIM = 39

const getContainerStyle = (noInternet: boolean, slim?: boolean): ViewStyle => ({
  marginTop: noInternet ? undefined : statusBarHeight,
  marginBottom: 4,
  paddingHorizontal: 20,
  paddingTop: slim ? 3 : undefined,
  width: deviceWidth,
  height: slim ? HEADER_HEIGHT_SLIM : HEADER_HEIGHT,
  flexDirection: 'row',
  alignItems: 'center',
})

const styles = StyleSheet.create({
  backIcon: { top: -1, marginRight: 14 },
  title: titleStyle,
  titleFlexed: { ...titleStyle, flex: 1 },
  inline: { flexDirection: 'row', alignItems: 'center', flex: 1 },
})