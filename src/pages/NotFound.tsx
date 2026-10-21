import { Link } from 'react-router'

export default function NotFound () {
  return (
    <div className='mx-auto max-w-xl px-4 py-24 text-center sm:px-6'>
      <p className='jp text-6xl font-bold text-primary' lang='ja' aria-hidden='true'>迷子</p>
      <h1 className='mt-6 text-2xl font-bold tracking-tight'>Page not found</h1>
      <p className='mt-3 text-muted'>This page doesn't exist or has moved. Check the address, or go back to the home page.</p>
      <div className='mt-8 flex justify-center gap-3'>
        <Link to='/' className='rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90'>Home</Link>
        <Link to='/docs' className='rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-surface'>Documentation</Link>
      </div>
    </div>
  )
}
