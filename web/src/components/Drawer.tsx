import Drawer from 'corvu/drawer'
import type { FlowComponent } from 'solid-js'
import HeaderLogoDark from '@assets/header_logo_dark.svg'
import HeaderLogoLight from '@assets/header_logo_light.svg'

const NavDrawer: FlowComponent = (props) => {
  return (
    <Drawer.Root side="left" breakPoints={[0.75]}>
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
              class="fixed inset-0 z-50 corvu-transitioning:transition-colors corvu-transitioning:duration-500 corvu-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{
                'background-color': `rgb(0 0 0 / ${
                  0.6 * drawerProps.openPercentage
                })`,
              }}
            />
            <Drawer.Content class="fixed inset-y-0 left-0 z-50 flex w-[230px] flex-col items-start bg-corvu-bg after:absolute after:inset-y-0 after:right-[calc(100%-1px)] after:w-[50%] after:bg-inherit corvu-transitioning:transition-transform corvu-transitioning:duration-500 corvu-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)]">
              <a href="/" class="mx-1 mt-[7px] flex rounded-lg py-2 pl-2 pr-4">
                <span class="sr-only">Corvu home</span>
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
              <div class="w-full overflow-auto pb-4 pl-3 pr-8 pt-2">
                {props.children}
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </>
      )}
    </Drawer.Root>
  )
}

export default NavDrawer
