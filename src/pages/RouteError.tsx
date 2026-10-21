import { Link, useRouteError } from 'react-router'

export default function RouteError () {
  const error = useRouteError()
  console.error(error)

  return (
    <div className='mx-auto max-w-xl px-4 py-24 text-center sm:px-6'>
      <h1 className='text-2xl font-bold tracking-tight'>Something went wrong</h1>
      <p className='mt-3 text-muted'>This page hit an error while loading. Reload the page, or go back to the home page.</p>
      <Link to='/' className='mt-8 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90'>Home</Link>
    </div>
  )
}
