import { 
  useEffect, 
  lazy, 
  useState, 
  Suspense 
} from 'react';

import { 
  ReactQueryDevtools 
} from '@tanstack/react-query-devtools'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import MeuCanteiroApp from './MeuCanteiroApp';

// Create a query client
const queryClient = new QueryClient()

// Lazy load the devtools in production
const ReactQueryDevtoolsProduction = lazy(() =>
  import(
    '@tanstack/react-query-devtools/build/modern/production.js'
    ).then(
    (d) => ({
      default: d.ReactQueryDevtools,
    }),
  ),
)

function App() {

  // TanStack Query Devtool State
  const [showDevtools, setShowDevtools] = useState(false)

  // Check Devtool
  useEffect(() => {
    // @ts-expect-error
    window.toggleDevtools = () => setShowDevtools((old) => !old)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <MeuCanteiroApp/>
      <ReactQueryDevtools initialIsOpen />
      {
        showDevtools && (
          <Suspense fallback={null}>
            <ReactQueryDevtoolsProduction />
          </Suspense>
        )
      }
    </QueryClientProvider>
  )
}

export default App
