import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function Icon ({ children, ...props }: IconProps) {
  return (
    <svg
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.75'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      {...props}
    >
      {children}
    </svg>
  )
}

export const GitHubIcon = (props: IconProps) => (
  <svg width='18' height='18' viewBox='0 0 16 16' fill='currentColor' aria-hidden='true' {...props}>
    <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z' />
  </svg>
)

export const SunIcon = (p: IconProps) => (
  <Icon {...p}><circle cx='12' cy='12' r='4' /><path d='M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41' /></Icon>
)
export const MoonIcon = (p: IconProps) => (
  <Icon {...p}><path d='M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z' /></Icon>
)
export const MonitorIcon = (p: IconProps) => (
  <Icon {...p}><rect x='3' y='4' width='18' height='12' rx='2' /><path d='M8 20h8M12 16v4' /></Icon>
)
export const MenuIcon = (p: IconProps) => (
  <Icon {...p}><path d='M4 7h16M4 12h16M4 17h16' /></Icon>
)
export const CloseIcon = (p: IconProps) => (
  <Icon {...p}><path d='M6 6l12 12M18 6L6 18' /></Icon>
)
export const CopyIcon = (p: IconProps) => (
  <Icon {...p}><rect x='9' y='9' width='11' height='11' rx='2' /><path d='M5 15V5a2 2 0 0 1 2-2h8' /></Icon>
)
export const CheckIcon = (p: IconProps) => (
  <Icon {...p}><path d='M5 12.5l4.5 4.5L19 7.5' /></Icon>
)
export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}><path d='M5 12h14M13 6l6 6-6 6' /></Icon>
)
export const DownloadIcon = (p: IconProps) => (
  <Icon {...p}><path d='M12 4v11M7 10.5l5 5 5-5M5 20h14' /></Icon>
)
export const ExternalIcon = (p: IconProps) => (
  <Icon {...p}><path d='M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5' /></Icon>
)
