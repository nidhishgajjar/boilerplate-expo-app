import { useOAuth } from '@clerk/clerk-expo'
import { Button } from './Button'
import { useCallback } from 'react'
import * as WebBrowser from 'expo-web-browser'
import { useWarmUpBrowser } from '../hooks/useWarmUpBrowser'

WebBrowser.maybeCompleteAuthSession()

export function OAuth() {
  useWarmUpBrowser()

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow()
      
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId })
      }
    } catch (err) {
      console.error('OAuth error:', err)
    }
  }, [startOAuthFlow])

  return (
    <Button onPress={onPress} mode="outlined">
      Continue with Google
    </Button>
  )
} 