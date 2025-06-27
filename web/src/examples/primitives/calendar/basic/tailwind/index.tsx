import { CaretLeft, CaretRight } from '@examples/primitives/calendar/icons'
import Calendar from '@corvu/calendar'
import { Index } from 'solid-js'
import type { VoidComponent } from 'solid-js'

const CalendarExample: VoidComponent = () => {
  return (
    <div>
      <Calendar mode="single">
        {(props) => {
          return (
            <div class="my-4 rounded-md bg-corvu-100 p-3 shadow-md md:my-8">
              <div class="flex items-center justify-between">
                <Calendar.Nav
                  action="prev-month"
                  aria-label="Go to previous month"
                  class="size-7 rounded-sm bg-corvu-200/50 p-1.25 hover:bg-corvu-200"
                >
                  <CaretLeft size="18" />
                </Calendar.Nav>
                <Calendar.Label class="text-sm">
                  {formatMonth(
                    props.month.toDate(
                      Intl.DateTimeFormat().resolvedOptions().timeZone,
                    ),
                  )}{' '}
                  {props.month.year}
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
                          abbr={formatWeekdayLong(
                            weekday().toDate(
                              Intl.DateTimeFormat().resolvedOptions().timeZone,
                            ),
                          )}
                          class="w-8 pb-1 text-xs font-normal opacity-65"
                        >
                          {formatWeekdayShort(
                            weekday().toDate(
                              Intl.DateTimeFormat().resolvedOptions().timeZone,
                            ),
                          )}
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
                                class="size-8 rounded-md text-sm focus-visible:bg-corvu-200/80 disabled:pointer-events-none disabled:opacity-40 data-selected:bg-corvu-300! data-today:bg-corvu-200/50 lg:hover:bg-corvu-200/80"
                              >
                                {day().day}
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
          )
        }}
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
