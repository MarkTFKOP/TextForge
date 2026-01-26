import type { ReactNode } from 'react'

import { Toaster } from '@/components/ui/sonner'

type AppProvidersProps = {
  children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => (
  <>
    <Toaster />
    {children}
  </>
)

