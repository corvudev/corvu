import { CaretLeft, CaretRight } from '@examples/primitives/calendar/icons'
import { For, Index } from 'solid-js'
import Calendar from '@corvu/calendar'
import type { VoidComponent } from 'solid-js'

const { format: formatWeekdayLong } = new Intl.DateTimeFormat('en', {
  weekday: 'long',
})
const { format: formatWeekdayShort } = new Intl.DateTimeFormat('en', {
  weekday: 'short',
})
const { format: formatMonth } = new Intl.DateTimeFormat('en', {
  month: 'long',
})

const CalendarExample: VoidComponent = () => {
  return (
    <Calendar mode="single">
      {(props) => (
        <div class="mt-4 rounded-md bg-corvu-100 p-3 shadow-md md:mt-8">
          <div class="flex items-center justify-between gap-4">
            <Calendar.Nav
              action="prev-month"
              aria-label="Go to previous month"
              class="size-7 rounded bg-corvu-200/50 p-[5px] hover:bg-corvu-200"
            >
              <CaretLeft size="18" />
            </Calendar.Nav>
            <Calendar.Label class="text-sm">
              {formatMonth(props.month)} {props.month.getFullYear()}
            </Calendar.Label>
            <Calendar.Nav
              action="next-month"
              aria-label="Go to next month"
              class="size-7 rounded bg-corvu-200/50 p-[5px] hover:bg-corvu-200"
            >
              <CaretRight size="18" />
            </Calendar.Nav>
          </div>
          <Calendar.Table class="mt-4">
            <thead>
              <tr>
                <For each={props.weekdays}>
                  {(weekday) => (
                    <Calendar.HeadCell
                      abbr={formatWeekdayLong(weekday)}
                      class="w-8 flex-1 pb-1 text-xs font-normal opacity-50"
                    >
                      {formatWeekdayShort(weekday)}
                    </Calendar.HeadCell>
                  )}
                </For>
              </tr>
            </thead>
            <tbody>
              <Index each={props.weeks}>
                {(week) => (
                  <tr>
                    <Index each={week()}>
                      {(day) => (
                        <Calendar.Cell day={day()}>
                          <Calendar.CellTrigger
                            day={day()}
                            class="inline-flex size-8 items-center justify-center rounded-md text-sm hover:bg-corvu-200/80 focus:bg-corvu-200/80 disabled:pointer-events-none disabled:opacity-40 corvu-selected:bg-corvu-300 corvu-today:bg-corvu-200/80"
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
      )}
    </Calendar>
  )
}

export default CalendarExample
