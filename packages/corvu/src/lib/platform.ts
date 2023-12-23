function testPlatform(regex: RegExp) {
  if (typeof window === 'undefined' || window.navigator === null) {
    return false
  }

  return regex.test(
    // @ts-expect-error: userAgentData is experimental and not yet in the DOM types
    window.navigator.userAgentData?.platform || window.navigator.platform,
  )
}

function isMac() {
  return testPlatform(/^Mac/i)
}

function isIPhone() {
  return testPlatform(/^iPhone/i)
}

function isIPad() {
  return testPlatform(/^iPad/i) || (isMac() && navigator.maxTouchPoints > 1)
}

function isIOS() {
  return isIPhone() || isIPad()
}

export { isIOS }
