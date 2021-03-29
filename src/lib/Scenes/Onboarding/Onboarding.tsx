import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { useFeatureFlag } from "lib/store/GlobalStore"
import React from "react"
import { KeyboardAvoidingView, View } from "react-native"
import { LogIn } from "./OldLogIn/LogIn"
import { OnboardingCreateAccount } from "./OnboardingCreateAccount"
import { OnboardingForgotPassword } from "./OnboardingForgotPassword"
import { OnboardingLogin } from "./OnboardingLogin"
import { OnboardingWelcome } from "./OnboardingWelcome"

// tslint:disable-next-line:interface-over-type-literal
export type OnboardingNavigationStack = {
  OnboardingWelcome: undefined
  OnboardingLogin: undefined
  OnboardingCreateAccount: undefined
  OnboardingForgotPassword: undefined
}

const StackNavigator = createStackNavigator<OnboardingNavigationStack>()

export const Onboarding = () => {
  const useNewOnboarding = useFeatureFlag("ARUseNewOnboarding")

  if (!useNewOnboarding) {
    return <LogIn />
  }

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer independent>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <StackNavigator.Navigator
            headerMode="screen"
            screenOptions={{
              ...TransitionPresets.SlideFromRightIOS,
            }}
          >
            <StackNavigator.Screen name="OnboardingWelcome" component={OnboardingWelcome} />
            <StackNavigator.Screen name="OnboardingLogin" component={OnboardingLogin} />
            <StackNavigator.Screen name="OnboardingCreateAccount" component={OnboardingCreateAccount} />
            <StackNavigator.Screen name="OnboardingForgotPassword" component={OnboardingForgotPassword} />
          </StackNavigator.Navigator>
        </KeyboardAvoidingView>
      </NavigationContainer>
    </View>
  )
}