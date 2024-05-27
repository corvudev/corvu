let otpFieldStyleElement: HTMLStyleElement | null = null

const createOtpFieldStyleElement = () => {
  if (otpFieldStyleElement) return
  otpFieldStyleElement = document.createElement('style')
  document.head.appendChild(otpFieldStyleElement)

  const autofillStyle =
    'background: transparent !important; color: transparent !important; border-color: transparent !important; opacity: 0 !important; box-shadow: none !important; -webkit-box-shadow: none !important; -webkit-text-fill-color: transparent !important;'
  const styleString = `
    [data-corvu-otp-field-input]::selection { background: transparent !important; color: transparent !important; }';
    [data-corvu-otp-field-input]:autofill { ${autofillStyle} };
    [data-corvu-otp-field-input]:-webkit-autofill { ${autofillStyle} };
    @supports (-webkit-touch-callout: none) { [data-corvu-otp-field-input] { letter-spacing: -.6em !important; font-weight: 100 !important; font-stretch: ultra-condensed; font-optical-sizing: none !important; left: -1px !important; right: 1px !important; } };
    [data-corvu-otp-field-input] + * { pointer-events: all !important; };
  `
  otpFieldStyleElement.innerHTML = styleString
}

export default createOtpFieldStyleElement
