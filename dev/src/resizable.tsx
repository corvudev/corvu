import Resizable from 'corvu/resizable'

const ResizableExample = () => {
  return (
    <Resizable.Root class="h-[400px] w-full">
      <Resizable.Panel initialSize={0.5} class="h-full bg-corvu-600" />
      <Resizable.ResizeHandle class="h-full w-2 bg-red-500" />
      <Resizable.Panel initialSize={0.5} class="h-full bg-sky-500">
        <Resizable.Root orientation="vertical" class="h-[400px] w-full">
          <Resizable.Panel initialSize={0.5} class="w-full bg-corvu-600" />
          <Resizable.ResizeHandle class="h-2 w-full bg-red-500" />
          <Resizable.Panel initialSize={0.5} class="w-full bg-sky-500" />
        </Resizable.Root>
      </Resizable.Panel>
    </Resizable.Root>
  )
}

export default ResizableExample
