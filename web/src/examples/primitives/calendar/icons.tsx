import { type JSX, splitProps } from 'solid-js'

export const CaretLeft = (
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
        points="160 208 80 128 160 48"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      />
    </svg>
  )
}

export const CaretRight = (
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
        points="96 48 176 128 96 208"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      />
    </svg>
  )
}
