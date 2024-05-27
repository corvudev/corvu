import { type Accessor, createContext, type Setter, useContext } from 'solid-js'
import {
  createKeyedContext,
  useKeyedContext,
} from '@corvu/utils/create/keyedContext'

export type OtpFieldContextValue = {
  /** The value of the OTP Field. */
  value: Accessor<string>
  /** Whether the OTP Field is currently focused. */
  isFocused: Accessor<boolean>
  /** Whether the OTP Field is currently hovered. */
  isHovered: Accessor<boolean>
  /** Whether the user is currently inserting a value and a fake caret should be shown. */
  isInserting: Accessor<boolean>
  /** The maximum number of chars in the OTP Field. */
  maxLength: Accessor<number>
  /** The currently active slots in the OTP Field. */
  activeSlots: Accessor<number[]>
  /** Whether to create extra space on the right for password managers. */
  shiftPWManagers: Accessor<boolean>
}

const OtpFieldContext = createContext<OtpFieldContextValue>()

export const createOtpFieldContext = (contextId?: string) => {
  if (contextId === undefined) return OtpFieldContext

  const context = createKeyedContext<OtpFieldContextValue>(
    `otp-field-${contextId}`,
  )
  return context
}

/** Context which exposes various properties to interact with the OTP Field. Optionally provide a contextId to access a keyed context. */
export const useOtpFieldContext = (contextId?: string) => {
  if (contextId === undefined) {
    const context = useContext(OtpFieldContext)
    if (!context) {
      throw new Error(
        '[corvu]: OTP Field context not found. Make sure to wrap OTP Field components in <OtpField.Root>',
      )
    }
    return context
  }

  const context = useKeyedContext<OtpFieldContextValue>(
    `otp-field-${contextId}`,
  )
  if (!context) {
    throw new Error(
      `[corvu]: OTP Field context with id "${contextId}" not found. Make sure to wrap OTP Field components in <OtpField.Root contextId="${contextId}">`,
    )
  }
  return context
}

export type InternalOtpFieldContextValue = OtpFieldContextValue & {
  rootHeight: Accessor<number>
  setValue: Setter<string>
  setIsFocused: Setter<boolean>
  setIsHovered: Setter<boolean>
  setIsInserting: Setter<boolean>
  setActiveSlots: Setter<number[]>
}

const InternalOtpFieldContext = createContext<InternalOtpFieldContextValue>()

export const createInternalOtpFieldContext = (contextId?: string) => {
  if (contextId === undefined) return InternalOtpFieldContext

  const context = createKeyedContext<InternalOtpFieldContextValue>(
    `otp-field-internal-${contextId}`,
  )
  return context
}

export const useInternalOtpFieldContext = (contextId?: string) => {
  if (contextId === undefined) {
    const context = useContext(InternalOtpFieldContext)
    if (!context) {
      throw new Error(
        '[corvu]: OTP Field context not found. Make sure to wrap OTP Field components in <OtpField.Root>',
      )
    }
    return context
  }

  const context = useKeyedContext<InternalOtpFieldContextValue>(
    `otp-field-internal-${contextId}`,
  )
  if (!context) {
    throw new Error(
      `[corvu]: OTP Field context with id "${contextId}" not found. Make sure to wrap OTP Field components in <OtpField.Root contextId="${contextId}">`,
    )
  }
  return context
}
