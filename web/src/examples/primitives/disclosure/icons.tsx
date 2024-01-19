import { splitProps, type JSX } from 'solid-js'

export const CaretUpDown = (
  props: Omit<JSX.SvgSVGAttributes<SVGSVGElement>, 'style'> & { size: string },
) => {
  const [local, others] = splitProps(props, ['size'])

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      style={{
        height: `${local.size}px`,
        width: `${local.size}px`,
      }}
      fill="currentColor"
      {...others}
    >
      <rect width="256" height="256" fill="none" />
      <polyline
        points="80 176 128 224 176 176"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      />
      <polyline
        points="80 80 128 32 176 80"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      />
    </svg>
  )
}

export const X = (
  props: Omit<JSX.SvgSVGAttributes<SVGSVGElement>, 'style'> & { size: string },
) => {
  const [local, others] = splitProps(props, ['size'])

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      style={{
        height: `${local.size}px`,
        width: `${local.size}px`,
      }}
      fill="currentColor"
      {...others}
    >
      <rect width="256" height="256" fill="none" />
      <line
        x1="200"
        y1="56"
        x2="56"
        y2="200"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      />
      <line
        x1="200"
        y1="200"
        x2="56"
        y2="56"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      />
    </svg>
  )
}
