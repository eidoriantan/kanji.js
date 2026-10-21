import { Link } from 'react-router'

export default function Logo () {
  return (
    <Link to='/' className='flex items-center gap-2 font-bold tracking-tight' aria-label='kanji.js home'>
      <span className='jp grid size-7 place-items-center rounded-md bg-primary text-[15px] text-on-primary' aria-hidden='true'>漢</span>
      <span>kanji.js</span>
    </Link>
  )
}
