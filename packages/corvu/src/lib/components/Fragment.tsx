import type { FlowComponent } from 'solid-js'

type Fragment = FlowComponent

/** Component that renders its children without a wrapper node. */
const Fragment: Fragment = (props) => <>{props.children}</>

export default Fragment
