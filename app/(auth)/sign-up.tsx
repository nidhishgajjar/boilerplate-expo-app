import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, View, StyleSheet, Pressable, Alert } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import React from 'react'
import { Button } from '../../components/Button'
import { Ionicons } from '@expo/vector-icons'
import { handleError } from '../../utils/error'

export default function SignUp() {
  const { signUp, setActive, isLoaded } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const validateInputs = () => {
    if (!emailAddress || !password) {
      Alert.alert('Missing Information', 'Please fill in all fields')
      return false
    }
    
    if (password.length < 8) {
      Alert.alert('Invalid Password', 'Password must be at least 8 characters long')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailAddress)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address')
      return false
    }

    return true
  }

  const onSignUpPress = async () => {
    if (!isLoaded) {
      handleError(new Error('Authentication is not ready'))
      return
    }
    
    if (!validateInputs()) return

    try {
      setLoading(true)
      setErrorMessage(null)

      const result = await signUp.create({
        emailAddress,
        password,
      })

      if (result.status === 'missing_requirements') {
        await signUp.prepareEmailAddressVerification()
        setPendingVerification(true)
        Alert.alert(
          'Verification Email Sent',
          'Please check your email for the verification code.'
        )
      } else if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.push('/')
      } else {
        setErrorMessage('Unable to complete signup. Please try again.')
      }
    } catch (err: any) {
      handleError(err, 'Unable to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) {
      handleError(new Error('Authentication is not ready'))
      return
    }

    if (!code) {
      Alert.alert('Missing Code', 'Please enter the verification code')
      return
    }
    
    try {
      setLoading(true)
      setErrorMessage(null)

      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        Alert.alert(
          'Success',
          'Your account has been verified!',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/')
            }
          ]
        )
      } else {
        setErrorMessage('Verification failed. Please try again.')
      }
    } catch (err: any) {
      handleError(err, 'Verification failed. Please check the code and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Pressable 
        style={styles.closeButton} 
        onPress={() => router.back()}
      >
        <Ionicons name="close" size={24} color="#000" />
      </Pressable>

      <View style={styles.content}>
        {!pendingVerification ? (
          <>
            <TextInput
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Email"
              onChangeText={setEmailAddress}
              style={styles.input}
              keyboardType="email-address"
            />
            <TextInput
              value={password}
              placeholder="Password"
              secureTextEntry
              onChangeText={setPassword}
              style={styles.input}
            />
            <Button 
              onPress={onSignUpPress}
              loading={loading}
            >
              Sign up
            </Button>
          </>
        ) : (
          <>
            <Text style={styles.title}>Verify your email</Text>
            <TextInput
              value={code}
              placeholder="Verification Code"
              onChangeText={setCode}
              style={styles.input}
              keyboardType="number-pad"
            />
            <Button 
              onPress={onVerifyPress}
              loading={loading}
            >
              Verify Email
            </Button>
          </>
        )}

        <View style={styles.footer}>
          <Text>Already have an account? </Text>
          <Link href="/" style={styles.link}>
            Sign in
          </Link>
        </View>

        {errorMessage && (
          <Text style={styles.errorText}>
            {errorMessage}
          </Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  link: {
    color: '#2196F3',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
}) 