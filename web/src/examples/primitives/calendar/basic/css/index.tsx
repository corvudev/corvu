import { CaretLeft, CaretRight } from '@examples/primitives/calendar/icons'
import Calendar from '@corvu/calendar'
import { Index } from 'solid-js'
import type { VoidComponent } from 'solid-js'

const CalendarExample: VoidComponent = () => {
  return (
    <div>
      <Calendar mode="single">
        {(props) => (
          <div class="wrapper">
            <div class="header">
              <Calendar.Nav
                action="prev-month"
                aria-label="Go to previous month"
              >
                <CaretLeft size="18" />
              </Calendar.Nav>
              <Calendar.Label>
                {formatMonth(
                  props.month.toDate(
                    Intl.DateTimeFormat().resolvedOptions().timeZone,
                  ),
                )}{' '}
                {props.month.year}
              </Calendar.Label>
              <Calendar.Nav action="next-month" aria-label="Go to next month">
                <CaretRight size="18" />
              </Calendar.Nav>
            </div>
            <Calendar.Table>
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
                          <Calendar.Cell>
                            <Calendar.CellTrigger day={day()}>
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
