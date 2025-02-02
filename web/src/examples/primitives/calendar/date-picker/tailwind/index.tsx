import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
} from '@examples/primitives/calendar/icons'
import { createUniqueId, Index, Show } from 'solid-js'
import Calendar from '@corvu/calendar'
import Popover from '@corvu/popover'
import type { VoidComponent } from 'solid-js'

const CalendarExample: VoidComponent = () => {
  const labelId = createUniqueId()

  return (
    <Calendar mode="single" labelIds={[labelId]}>
      {(props) => (
        <Popover
          placement="bottom-start"
          floatingOptions={{
            offset: 5,
            flip: true,
          }}
          initialFocusEl={props.focusedDayRef ?? undefined}
          labelId={labelId}
        >
          <Popover.Trigger class="my-auto flex w-56 items-center space-x-2 rounded-md bg-corvu-100 px-3 py-2 transition-all duration-100 hover:bg-corvu-200">
            <CalendarBlank size="20" />
            <Show when={props.value} fallback={<span>Pick a date</span>}>
              <span>{formatTrigger(props.value!)}</span>
            </Show>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content class="z-50 rounded-lg bg-corvu-100 shadow-md data-open:animate-in data-open:fade-in-50% data-open:slide-in-from-top-1 data-closed:animate-out data-closed:fade-out-50% data-closed:slide-out-to-top-1">
              <div class="rounded-md bg-corvu-100 p-3 shadow-md">
                <div class="flex items-center justify-between gap-4">
                  <Calendar.Nav
                    action="prev-month"
                    aria-label="Go to previous month"
                    class="size-7 rounded-sm bg-corvu-200/50 p-1.25 hover:bg-corvu-200"
                  >
                    <CaretLeft size="18" />
                  </Calendar.Nav>
                  <Calendar.Label as={Popover.Label} class="text-sm">
                    {formatMonth(props.month)} {props.month.getFullYear()}
                  </Calendar.Label>
                  <Calendar.Nav
                    action="next-month"
                    aria-label="Go to next month"
                    class="size-7 rounded-sm bg-corvu-200/50 p-1.25 hover:bg-corvu-200"
                  >
                    <CaretRight size="18" />
                  </Calendar.Nav>
                </div>
                <Calendar.Table class="mt-3">
                  <thead>
                    <tr>
                      <Index each={props.weekdays}>
                        {(weekday) => (
                          <Calendar.HeadCell
                            abbr={formatWeekdayLong(weekday())}
                            class="w-8 flex-1 pb-1 text-xs font-normal opacity-65"
                          >
                            {formatWeekdayShort(weekday())}
                          </Calendar.HeadCell>
                        )}
                      </Index>
                    </tr>
                  </thead>
                  <tbody>
                    <Index each={props.weeks}>
                      {(week) => (
                        <tr>
                          <Index each={week()}>
                            {(day) => (
                              <Calendar.Cell class="p-0">
                                <Calendar.CellTrigger
                                  day={day()}
                                  class="inline-flex size-8 items-center justify-center rounded-md text-sm focus-visible:bg-corvu-200/80 disabled:pointer-events-none disabled:opacity-40 data-selected:bg-corvu-300! data-today:bg-corvu-200/50 lg:hover:bg-corvu-200/80"
                                >
                                  {day().getDate()}
                                </Calendar.CellTrigger>
                              </Calendar.Cell>
                            )}
                          </Index>
                        </tr>
                      )}
                    </Index>
                  </tbody>
                </Calendar.Table>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover>
      )}
    </Calendar>
  )
}

const { format: formatWeekdayLong } = new Intl.DateTimeFormat('en', {
  weekday: 'long',
})
const { format: formatWeekdayShort } = new Intl.DateTimeFormat('en', {
  weekday: 'short',
})
const { format: formatMonth } = new Intl.DateTimeFormat('en', {
  month: 'long',
})
const { format: formatTrigger } = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export default CalendarExample
