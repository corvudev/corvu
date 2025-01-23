import { CaretLeft, CaretRight } from '@examples/primitives/calendar/icons'
import { Index, Show } from 'solid-js'
import Calendar from '@corvu/calendar'
import type { VoidComponent } from 'solid-js'

const CalendarExample: VoidComponent = () => {
  return (
    <div>
      <Calendar mode="range" numberOfMonths={2}>
        {(props) => (
          <div class="my-4 flex space-x-4 rounded-md bg-corvu-100 p-3 shadow-md md:my-8">
            <Index each={props.months}>
              {(month, index) => (
                <div>
                  <div class="relative flex items-center justify-center">
                    <Show when={index === 0}>
                      <Calendar.Nav
                        action="prev-month"
                        aria-label="Go to previous month"
                        class="absolute left-0 size-7 rounded bg-corvu-200/50 p-[5px] hover:bg-corvu-200"
                      >
                        <CaretLeft size="18" />
                      </Calendar.Nav>
                    </Show>
                    <Calendar.Label index={index} class="col-start-2 text-sm">
                      {formatMonth(month().month)} {month().month.getFullYear()}
                    </Calendar.Label>
                    <Show when={index === props.months.length - 1}>
                      <Calendar.Nav
                        action="next-month"
                        aria-label="Go to next month"
                        class="absolute right-0 size-7 rounded bg-corvu-200/50 p-[5px] hover:bg-corvu-200"
                      >
                        <CaretRight size="18" />
                      </Calendar.Nav>
                    </Show>
                  </div>
                  <Calendar.Table index={index} class="mt-3">
                    <thead>
                      <tr>
                        <Index each={props.weekdays}>
                          {(weekday) => (
                            <Calendar.HeadCell
                              abbr={formatWeekdayLong(weekday())}
                              class="w-8 flex-1 pb-1 text-xs font-normal opacity-50"
                            >
                              {formatWeekdayShort(weekday())}
                            </Calendar.HeadCell>
                          )}
                        </Index>
                      </tr>
                    </thead>
                    <tbody>
                      <Index each={month().weeks}>
                        {(week) => (
                          <tr>
                            <Index each={week()}>
                              {(day) => (
                                <Calendar.Cell class="p-0">
                                  <Calendar.CellTrigger
                                    day={day()}
                                    month={month().month}
                                    class="inline-flex size-8 items-center justify-center rounded-md text-sm focus-visible:bg-corvu-200/80 disabled:pointer-events-none disabled:opacity-40 corvu-selected:!bg-corvu-300 corvu-today:bg-corvu-200/50 lg:hover:bg-corvu-200/80"
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
            </Index>
          </div>
        )}
      </Calendar>
    </div>
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

export default CalendarExample
