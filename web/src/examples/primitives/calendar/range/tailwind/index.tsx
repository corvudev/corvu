import { CaretLeft, CaretRight } from '@examples/primitives/calendar/icons'
import Calendar from '@corvu/calendar'
import { Index } from 'solid-js'
import type { VoidComponent } from 'solid-js'

const CalendarExample: VoidComponent = () => {
  return (
    <div>
      <Calendar mode="range" numberOfMonths={2}>
        {(props) => (
          <div class="relative my-4 rounded-md bg-corvu-100 p-3 shadow-md md:my-8">
            <Calendar.Nav
              action="prev-month"
              aria-label="Go to previous month"
              class="absolute left-3 size-7 rounded bg-corvu-200/50 p-[5px] hover:bg-corvu-200"
            >
              <CaretLeft size="18" />
            </Calendar.Nav>
            <Calendar.Nav
              action="next-month"
              aria-label="Go to next month"
              class="absolute right-3 size-7 rounded bg-corvu-200/50 p-[5px] hover:bg-corvu-200"
            >
              <CaretRight size="18" />
            </Calendar.Nav>
            <div class="space-y-4 md:flex md:space-x-4 md:space-y-0">
              <Index each={props.months}>
                {(month, index) => (
                  <div>
                    <div class="flex h-7 items-center justify-center">
                      <Calendar.Label index={index} class="text-sm">
                        {formatMonth(month().month)}{' '}
                        {month().month.getFullYear()}
                      </Calendar.Label>
                    </div>
                    <Calendar.Table index={index} class="mt-3">
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
                        <Index each={month().weeks}>
                          {(week) => (
                            <tr>
                              <Index each={week()}>
                                {(day) => (
                                  <Calendar.Cell class="p-0 has-[[data-range-end]]:rounded-r-md has-[[data-range-start]]:rounded-l-md has-[[data-in-range]]:bg-corvu-200/70 has-[[disabled]]:opacity-40 has-[[data-in-range]]:first:rounded-l-md has-[[data-in-range]]:last:rounded-r-md">
                                    <Calendar.CellTrigger
                                      day={day()}
                                      month={month().month}
                                      class="inline-flex size-8 items-center justify-center rounded-md text-sm focus-visible:bg-corvu-200/80 disabled:pointer-events-none corvu-today:bg-corvu-200/50 corvu-range-start:!bg-corvu-300 corvu-range-end:!bg-corvu-300 lg:hover:bg-corvu-200/80"
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
