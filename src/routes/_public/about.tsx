import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_public/about"!</div>
}
