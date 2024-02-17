import * as React from 'react'
import { useEffect, useState } from 'react';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import CanteiroForm from './components/Canteiro-form';
import Header from './components/Header';
import ToggleBtn from './components/Toggle-btn';
import AddForm from './components/Add-form';
import DeleteForm from './components/Delete-form';

import headerImage from './assets/saf_bg.png';

// Create a query client
const queryClient = new QueryClient()

// Lazy load the devtools in production
const ReactQueryDevtoolsProduction = React.lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then(
    (d) => ({
      default: d.ReactQueryDevtools,
    }),
  ),
)

function App() {

  // TanStack Query Devtool State
  const [showDevtools, setShowDevtools] = React.useState(false)

  // Toggle Forms States
  const [addForm, setAddForm] = useState(false);
  const [delForm, setDelForm] = useState(false);

  // Check Devtool
  useEffect(() => {
    // @ts-expect-error
    window.toggleDevtools = () => setShowDevtools((old) => !old)
  }, [])

  // Toggle button function
  const handleToggleBtn = (e) => {
    const btnId = e.target.id
    switch (btnId) {
      case "addForm_toggleBtn":
        setAddForm(a => !a)
        break;
      case "deleteForm_toggleBtn":
        setDelForm(d => !d)
        break;
      default:
        break;
    }
  }

  console.log([addForm, delForm])


  return (
    <QueryClientProvider client={queryClient}>
      <>
        <Header
          imgSrc={headerImage}
        />
        <main id="main">
          <CanteiroForm/>
        </main>
        <aside id="aside">
          <section className="section--toggle">
            <ToggleBtn
                btnId="addForm_toggleBtn"
                btnImgId="toggleBtnImgAdd"
                btnText="Adicionar Planta"
                toggleForm={addForm}
                onClickToggleBtn={handleToggleBtn}
            />
            <AddForm
              toggle={addForm}
            />
          </section>
          <section className="section--toggle">
            <ToggleBtn
                btnId="deleteForm_toggleBtn"
                btnImgId="toggleBtnImgDel"
                btnText="Deletar Planta"
                toggleForm={delForm}
                onClickToggleBtn={handleToggleBtn}
            />
            <DeleteForm
              toggle={delForm}
            />
          </section>
        </aside>
      </>
      <ReactQueryDevtools initialIsOpen />
      {
        showDevtools && (
          <React.Suspense fallback={null}>
            <ReactQueryDevtoolsProduction />
          </React.Suspense>
        )
      }
    </QueryClientProvider>
  )

  return (
    <>
      <Header
        imgSrc={headerImage}
      />
      <main id="main">
        <CanteiroForm/>
      </main>
      <aside id="aside">
        <section className="section--toggle">
          <ToggleBtn
              btnId="addForm_toggleBtn"
              btnImgId="toggleBtnImgAdd"
              btnText="Adicionar Planta"
              toggleForm={addForm}
              onClickToggleBtn={handleToggleBtn}
          />
          <AddForm
            toggle={addForm}
          />
        </section>
        <section className="section--toggle">
          <ToggleBtn
              btnId="deleteForm_toggleBtn"
              btnImgId="toggleBtnImgDel"
              btnText="Deletar Planta"
              toggleForm={delForm}
              onClickToggleBtn={handleToggleBtn}
          />
          <DeleteForm
            toggle={delForm}
          />
        </section>
      </aside>
    </>
  )
}

export default App
