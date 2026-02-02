import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_public/contact"!</div>
}
