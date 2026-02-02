import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/gallery')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_public/gallery"!</div>
}
