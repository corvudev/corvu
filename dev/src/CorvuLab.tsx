import { For, Index } from 'solid-js'
import { format, isAfter } from 'date-fns'
import Calendar from '@corvu/calendar'

const { format: formatWeekdayLong } = new Intl.DateTimeFormat('en', {
  weekday: 'long',
})
const { format: formatWeekdayShort } = new Intl.DateTimeFormat('en', {
  weekday: 'short',
})

export default () => {
  return (
    <div class="flex h-full items-center justify-center">
      <Calendar mode="single" disabled={(date) => isAfter(date, new Date())}>
        {(props) => (
          <div class="z-50 rounded-md border bg-corvu-bg p-3 text-corvu-text shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
            <div class="flex items-center justify-between gap-4">
              <Calendar.Nav
                action="prev-month"
                class="inline-flex size-7 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-corvu-100 bg-transparent p-0 text-sm font-medium opacity-50 ring-offset-corvu-100 hover:bg-corvu-200 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corvu-200 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="size-4"
                >
                  <path d="M15 6l-6 6l6 6" />
                  <title>Previous</title>
                </svg>
              </Calendar.Nav>
              <Calendar.Label>
                {format(props.month, 'MMMM yyyy')}
              </Calendar.Label>
              <Calendar.Nav
                action="next-month"
                class="inline-flex size-7 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-corvu-100 bg-transparent p-0 text-sm font-medium opacity-50 ring-offset-corvu-100 hover:bg-corvu-200 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corvu-200 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="size-4"
                >
                  <path d="M9 6l6 6l-6 6" />
                  <title>Next</title>
                </svg>
              </Calendar.Nav>
            </div>
            <Calendar.View view="day" class="mt-2">
              <Calendar.Table>
                <thead>
                  <tr>
                    <For each={props.weekdays}>
                      {(weekday) => (
                        <Calendar.HeadCell
                          abbr={formatWeekdayLong(weekday)}
                          class="w-8 flex-1 text-sm font-normal text-gray-600"
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
                            <Calendar.Cell
                              day={day()}
                              class="flex-1 p-0 text-center text-sm has-[[data-range-end]]:rounded-r-md has-[[data-range-start]]:rounded-l-md has-[[data-in-range]]:bg-corvu-100 has-[[data-in-range]]:first-of-type:rounded-l-md has-[[data-in-range]]:last-of-type:rounded-r-md"
                            >
                              <Calendar.CellTrigger
                                day={day()}
                                class="inline-flex size-8 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md p-0 text-sm font-normal ring-offset-corvu-bg hover:bg-corvu-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corvu-200 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[outside-range]:opacity-50 data-[selected]:opacity-100 corvu-disabled:text-gray-600 corvu-disabled:opacity-50 corvu-selected:bg-corvu-200 corvu-today:bg-corvu-100 [&:is([data-outside-range][data-in-range])]:opacity-30 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
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
            </Calendar.View>
            <Calendar.View view="month">ign</Calendar.View>
          </div>
        )}
      </Calendar>
    </div>
  )
}
