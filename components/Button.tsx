import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { forwardRef } from 'react'

interface ButtonProps {
  children: React.ReactNode
  onPress?: () => void
  loading?: boolean
  mode?: 'contained' | 'outlined'
}

export const Button = forwardRef<View, ButtonProps>(({ 
  children, 
  onPress, 
  loading, 
  mode = 'contained' 
}, ref) => {
  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        styles.button,
        mode === 'outlined' && styles.outlined,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={mode === 'contained' ? '#fff' : '#000'} />
        ) : (
          <Text style={[
            styles.text,
            mode === 'outlined' && styles.outlinedText
          ]}>
            {children}
          </Text>
        )}
      </View>
    </Pressable>
  )
})

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 100,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  pressed: {
    opacity: 0.7,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  outlinedText: {
    color: '#2196F3',
  },
}) 