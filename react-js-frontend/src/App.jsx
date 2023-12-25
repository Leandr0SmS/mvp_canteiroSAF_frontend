import Form from './components/Form'
import Header from './components/Header'
import headerImage from './assets/saf_bg.png'

function App() {

  return (
    <>
      <Header
        imgSrc={headerImage}
      />
      <main id="main">
        <Form/>
      </main>
      <aside id="aside">
        
      </aside>
    </>
  )
}

export default App
