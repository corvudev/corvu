import {
  createEffect,
  createSignal,
  Match,
  onCleanup,
  Switch,
  type VoidComponent,
} from 'solid-js'

const Background: VoidComponent<{ type: 'home' | 'docs' }> = (props) => {
  const [x, setX] = createSignal<number | null>(null)
  const [y, setY] = createSignal<number | null>(null)

  createEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      setX(e.clientX)
      setY(e.clientY)
    }
    const onPointerOut = () => {
      setX(null)
      setY(null)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerout', onPointerOut)

    onCleanup(() => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerout', onPointerOut)
    })
  })

  return (
    <Switch>
      <Match when={props.type === 'home'}>
        <div class="fixed inset-0 -z-20">
          <div
            class="absolute -z-20 hidden size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(hsl(var(--corvu-400)),#ffffff00_120%)] blur-md md:block"
            style={{
              display: x() === null ? 'none' : undefined,
              left: `${x() ?? 0}px`,
              top: `${y() ?? 0}px`,
            }}
          />
          <div class="absolute inset-0 -z-20 bg-corvu-400/50 dark:bg-corvu-400/25" />
          <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,#ffffff00_2px,hsl(var(--corvu-bg))_0)] bg-[length:28px_28px] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_368px,hsl(var(--corvu-bg))_100px,#ffffff00_1000px,#ffffff00_100%)]" />
        </div>
      </Match>
      <Match when={props.type === 'docs'}>
        <div class="fixed inset-0 -z-20 hidden md:block">
          <div
            class="absolute -z-20 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(hsl(var(--corvu-400)),#ffffff00_120%)] blur-md"
            style={{
              display: x() === null ? 'none' : undefined,
              left: `${x() ?? 0}px`,
              top: `${y() ?? 0}px`,
            }}
          />
          <div class="absolute inset-0 -z-20 bg-corvu-400/50 dark:bg-corvu-400/25" />
          <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,#ffffff00_2px,hsl(var(--corvu-bg))_0)] bg-[length:28px_28px] after:absolute after:inset-0 after:bg-[linear-gradient(to_right,#ffffff00_0%,hsl(var(--corvu-bg))_20%,hsl(var(--corvu-bg))_100%)] lg:after:bg-[linear-gradient(to_right,#ffffff00_0%,hsl(var(--corvu-bg))_25%,hsl(var(--corvu-bg))_75%,#ffffff00_90%)]" />
        </div>
      </Match>
    </Switch>
  )
}

export default Background
