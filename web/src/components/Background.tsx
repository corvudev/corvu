import clsx from 'clsx'
import {
  createEffect,
  createSignal,
  Match,
  onCleanup,
  type VoidComponent,
  Switch,
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
    // if coursor moves outside of the window, set x and y to null
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
            class="absolute -z-20 hidden size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(#7250AE,transparent_120%)] blur-md md:block"
            style={{
              display: x() === null ? 'none' : undefined,
              left: `${x()}px`,
              top: `${y()}px`,
            }}
          />
          <div class="absolute inset-0 -z-20 bg-corvu-accent/40" />
          <div
            class={clsx([
              'fixed inset-0 -z-10 bg-[length:28px_28px]',
              'bg-[radial-gradient(circle_at_center,_transparent_2px,_#f2f0fe_0)] dark:bg-[radial-gradient(circle_at_center,_transparent_2px,_#0C0812_0)]',
              'after:absolute after:inset-0',
              'after:bg-[radial-gradient(circle_at_50%_35%,#f2f0fe_80px,transparent_100%)] dark:after:bg-[radial-gradient(circle_at_50%_35%,#0C0812_80px,transparent_100%)]',
            ])}
          />
        </div>
      </Match>
      <Match when={props.type === 'docs'}>
        <div class="fixed inset-0 -z-20 hidden md:block">
          <div
            class="absolute -z-20 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(#7250AE,transparent_120%)] blur-md"
            style={{
              display: x() === null ? 'none' : 'block',
              left: `${x()}px`,
              top: `${y()}px`,
            }}
          />
          <div class="absolute inset-0 -z-20 bg-corvu-accent/40" />
          <div
            class={clsx([
              'absolute inset-0 -z-10 bg-[length:28px_28px]',
              'bg-[radial-gradient(circle_at_center,_transparent_2px,_#f2f0fe_0)] dark:bg-[radial-gradient(circle_at_center,_transparent_2px,_#0C0812_0)] ',
              'after:absolute after:inset-0',
              'after:bg-[linear-gradient(to_right,transparent,20%,#f2f0fe_calc(50%))] dark:after:bg-[linear-gradient(to_right,transparent,20%,#0C0812_calc(50%))]',
              'lg:after:bg-[linear-gradient(to_right,transparent,20%,#f2f0fe_calc(50%),80%,transparent)] dark:lg:after:bg-[linear-gradient(to_right,transparent,20%,#0C0812_calc(50%),80%,transparent)]',
            ])}
          />
        </div>
      </Match>
    </Switch>
  )
}

export default Background
