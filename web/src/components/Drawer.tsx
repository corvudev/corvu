import Drawer from '@corvu/drawer'
import type { FlowComponent } from 'solid-js'
import HeaderLogoDark from '@assets/header_logo_dark.svg'
import HeaderLogoLight from '@assets/header_logo_light.svg'

const NavDrawer: FlowComponent = (props) => {
  return (
    <Drawer side="left" breakPoints={[0.75]}>
      {(drawerProps) => (
        <>
          <Drawer.Trigger class="p-1.5 md:hidden">
            <span class="sr-only">Open navigation</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="size-6"
              fill="currentColor"
            >
              <g>
                <g>
                  <rect
                    width="24"
                    height="24"
                    transform="rotate(180 12 12)"
                    opacity="0"
                  />
                  <rect x="3" y="11" width="18" height="2" rx=".95" ry=".95" />
                  <rect x="3" y="16" width="18" height="2" rx=".95" ry=".95" />
                  <rect x="3" y="6" width="18" height="2" rx=".95" ry=".95" />
                </g>
              </g>
            </svg>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay
              class="fixed inset-0 z-50 data-transitioning:transition-colors data-transitioning:duration-500 data-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{
                'background-color': `rgb(0 0 0 / ${
                  0.6 * drawerProps.openPercentage
                })`,
              }}
            />
            <Drawer.Content class="fixed inset-y-0 left-0 z-50 flex w-57.5 flex-col items-start bg-corvu-bg after:absolute after:inset-y-0 after:right-[calc(100%-1px)] after:w-1/2 after:bg-inherit data-transitioning:transition-transform data-transitioning:duration-500 data-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)]">
              <a
                href="/"
                class="flex h-18 w-full shrink-0 items-center rounded-bl-xl border-b-4 border-corvu-200 px-3"
              >
                <span class="sr-only">corvu</span>
                <img
                  src={HeaderLogoDark.src}
                  alt="corvu logo dark"
                  height={42}
                  width={136}
                  class="dark:hidden"
                />
                <img
                  src={HeaderLogoLight.src}
                  alt="corvu logo light"
                  height={42}
                  width={136}
                  class="hidden dark:block"
                />
              </a>
              <div class="w-full overflow-y-auto pb-10 pl-3 pr-8 pt-2 scrollbar-thin">
                {props.children}
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </>
      )}
    </Drawer>
  )
}

export default NavDrawer
