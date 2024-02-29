import { createEffect, onCleanup, type VoidComponent } from 'solid-js'
import clsx from 'clsx'

const ThemeSelect: VoidComponent = () => {
  const toggleTheme = () => {
    const currentTheme = getCurrentTheme()
    if (currentTheme.theme !== currentTheme.system) {
      localStorage.removeItem('theme')
    } else {
      localStorage.theme = currentTheme.theme === 'dark' ? 'light' : 'dark'
    }
    updateTheme()
  }

  createEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', updateTheme)
    window.addEventListener('storage', updateTheme)

    onCleanup(() => {
      mediaQuery.removeEventListener('change', updateTheme)
      window.removeEventListener('storage', updateTheme)
    })
  })

  return (
    <button onClick={toggleTheme} class="p-2">
      <SunIcon class="dark:hidden" />
      <MoonIcon class="hidden dark:block" />
      <span class="sr-only">Toggle theme</span>
    </button>
  )
}

export default ThemeSelect

const updateTheme = () => {
  document.documentElement.classList.add('changing-theme')
  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('changing-theme')
    })
  })
}

const getCurrentTheme = () => {
  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    return {
      theme: 'dark',
      system: window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light',
    }
  } else {
    return {
      theme: 'light',
      system: window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light',
    }
  }
}

const SunIcon: VoidComponent<{
  class?: string
}> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      class={clsx('size-5', props.class)}
    >
      <rect width="256" height="256" fill="none" />
      <line
        x1="128"
        y1="32"
        x2="128"
        y2="16"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      />
      <circle
        cx="128"
        cy="128"
        r="56"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      />
      <line
        x1="60"
        y1="60"
        x2="48"
        y2="48"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      />
      <line
        x1="60"
        y1="196"
        x2="48"
        y2="208"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      />
      <line
        x1="196"
        y1="60"
        x2="208"
        y2="48"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      />
      <line
        x1="196"
        y1="196"
        x2="208"
        y2="208"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      />
      <line
        x1="32"
        y1="128"
        x2="16"
        y2="128"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      />
      <line
        x1="128"
        y1="224"
        x2="128"
        y2="240"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      />
      <line
        x1="224"
        y1="128"
        x2="240"
        y2="128"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      />
    </svg>
  )
}

const MoonIcon: VoidComponent<{
  class?: string
}> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      class={clsx('size-5', props.class)}
    >
      <rect width="256" height="256" fill="none" />
      <line
        x1="208"
        y1="120"
        x2="208"
        y2="72"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      />
      <line
        x1="232"
        y1="96"
        x2="184"
        y2="96"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      />
      <line
        x1="160"
        y1="32"
        x2="160"
        y2="64"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      />
      <line
        x1="176"
        y1="48"
        x2="144"
        y2="48"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      />
      <path
        d="M210.69,158.18A96.78,96.78,0,0,1,192,160,96.08,96.08,0,0,1,97.82,45.31,88,88,0,1,0,210.69,158.18Z"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      />
    </svg>
  )
}
