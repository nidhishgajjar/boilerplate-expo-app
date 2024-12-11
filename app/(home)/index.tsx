import { SignedIn, SignedOut, useAuth, useUser, useSignIn } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { 
  Text, 
  View, 
  StyleSheet, 
  Image, 
  TextInput, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView 
} from 'react-native'
import React from 'react'
import { OAuth } from '@/components/OAuth'
import * as WebBrowser from 'expo-web-browser'
import { handleError } from '@/utils/error'
import { Alert } from 'react-native'
import { Button } from '@/components/Button'

export default function Home() {
  const { user } = useUser()
  const { signOut } = useAuth()
  const { signIn, setActive, isLoaded } = useSignIn()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const onSignInPress = async () => {
    if (!isLoaded) {
      handleError(new Error('Authentication is not ready'))
      return
    }

    if (!emailAddress || !password) {
      Alert.alert('Missing Information', 'Please fill in all fields')
      return
    }
    
    try {
      setLoading(true)
      setErrorMessage(null)
      
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
      } else {
        setErrorMessage('Unable to sign in. Please try again.')
      }
    } catch (err: any) {
      handleError(err, 'Unable to sign in. Please check your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    try {
      await WebBrowser.openBrowserAsync('https://peaceful-whippet-67.accounts.dev/sign-in')
    } catch (err) {
      handleError(err, 'Unable to open password reset page. Please try again.')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <SignedIn>
        <View style={styles.signedInContainer}>
          <Image 
            source={{ uri: user?.imageUrl }} 
            style={styles.avatar}
          />
          <Text style={styles.welcomeText}>
            Welcome, {user?.firstName || user?.emailAddresses[0].emailAddress}
          </Text>
          <Button onPress={() => signOut()} mode="outlined">
            Sign Out
          </Button>
        </View>
      </SignedIn>
      
      <SignedOut>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.authContainer}>
              <Text style={styles.title}>Welcome</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
              
              <View style={styles.buttonContainer}>
                <OAuth />
                
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TextInput
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Email"
                  onChangeText={setEmailAddress}
                  style={styles.input}
                />
                <TextInput
                  value={password}
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={setPassword}
                  style={styles.input}
                />
                
                <Button 
                  onPress={onSignInPress}
                  loading={loading}
                  mode="contained"
                >
                  Sign In
                </Button>

                <Text 
                  onPress={handleForgotPassword}
                  style={styles.forgotPasswordText}
                >
                  Forgot password?
                </Text>
                
                <Link href="/sign-up" asChild>
                  <Button mode="outlined">Create Account</Button>
                </Link>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SignedOut>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  signedInContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  authContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    gap: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  forgotPasswordText: {
    color: '#2196F3',
    textAlign: 'center',
    marginVertical: 10,
  },
})

