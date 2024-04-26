import { children, type ParentComponent, Show } from 'solid-js'
import clsx from 'clsx'
import Drawer from '@components/Drawer'
import HeaderLogoDark from '@assets/header_logo_dark.svg'
import HeaderLogoLight from '@assets/header_logo_light.svg'
import ThemeSelect from '@components/ThemeSelect'

const Topbar: ParentComponent<{
  floating: boolean
}> = (props) => {
  const resolvedChildren = children(() => props.children)

  return (
    <header
      class="pointer-events-none fixed inset-x-0 top-0 z-30"
      style={{
        'padding-right': 'var(--scrollbar-width, 0)',
      }}
    >
      <div
        class={clsx(
          'mx-auto flex h-[72px] max-w-7xl items-center justify-between rounded-b-xl border-b-4 px-3',
          {
            'border-corvu-200 bg-corvu-bg lg:border-transparent lg:bg-transparent':
              !props.floating,
            'border-transparent': props.floating,
          },
        )}
      >
        <a href="/" class="pointer-events-auto">
          <span class="sr-only">corvu</span>
          <img
            src={HeaderLogoDark.src}
            alt="Corvu logo"
            height={42}
            width={136}
            class="dark:hidden"
          />
          <img
            src={HeaderLogoLight.src}
            alt="Corvu logo"
            height={42}
            width={136}
            class="hidden dark:block"
          />
        </a>
        <div class="pointer-events-auto flex items-center space-x-2">
          <ThemeSelect />
          <a
            href="https://github.com/corvudev/corvu/"
            target="_blank"
            class="p-2"
          >
            <span class="sr-only">GitHub repository</span>
            <svg
              data-hk="0-0-0-0-0-0-0-0-0-1-0-0-0-0-2-1-0-0-4-0-3-0-1-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 98 96"
              width="20"
              height="20"
            >
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
          <Show when={resolvedChildren()}>
            <Drawer>{resolvedChildren()}</Drawer>
          </Show>
        </div>
      </div>
    </header>
  )
}

export default Topbar
