import {
  type OtpFieldContextValue as ContextValue,
  useOtpFieldContext as useContext,
} from '@src/context'
import Input, {
  type OtpFieldInputCorvuProps as InputCorvuProps,
  type OtpFieldInputElementProps as InputElementProps,
  type OtpFieldInputProps as InputProps,
  type OtpFieldInputSharedElementProps as InputSharedElementProps,
} from '@src/Input'
import Root, {
  type OtpFieldRootChildrenProps as RootChildrenProps,
  type OtpFieldRootCorvuProps as RootCorvuProps,
  type OtpFieldRootElementProps as RootElementProps,
  type OtpFieldRootProps as RootProps,
  type OtpFieldRootSharedElementProps as RootSharedElementProps,
} from '@src/Root'
import type { DynamicProps } from '@corvu/utils/dynamic'

export type {
  RootCorvuProps,
  RootSharedElementProps,
  RootElementProps,
  RootProps,
  RootChildrenProps,
  InputCorvuProps,
  InputSharedElementProps,
  InputElementProps,
  InputProps,
  ContextValue,
  DynamicProps,
}

export { Root, Input, useContext }

const OtpField = Object.assign(Root, {
  Input,
  useContext,
})

export default OtpField
