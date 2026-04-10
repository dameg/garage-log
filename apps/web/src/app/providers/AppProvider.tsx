import type { PropsWithChildren } from 'react';

import { MantineAppProvider } from './MantineAppProvider';
import { QueryProvider } from './QueryProvider';

export function AppProvider({ children }: PropsWithChildren) {
  return (
    <MantineAppProvider>
      <QueryProvider>{children}</QueryProvider>
    </MantineAppProvider>
  );
}
