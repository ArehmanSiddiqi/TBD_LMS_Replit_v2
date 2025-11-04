import posthog from 'posthog-js'

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (import.meta.env.VITE_PUBLIC_POSTHOG_KEY) {
    posthog.capture(eventName, properties)
  }
}

export const identifyUser = (userId: string, userProperties?: Record<string, any>) => {
  if (import.meta.env.VITE_PUBLIC_POSTHOG_KEY) {
    posthog.identify(userId, userProperties)
  }
}

export const resetUser = () => {
  if (import.meta.env.VITE_PUBLIC_POSTHOG_KEY) {
    posthog.reset()
  }
}