import CanteiroForm from './components/Canteiro-form'
import Header from './components/Header'
import ToggleBtn from './components/Toggle-btn'

import headerImage from './assets/saf_bg.png'
import btnImgExpandMore from './assets/expand_more.svg'
import btnImgExpandLess from './assets/expand_less.svg'

function App() {

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
              btnImgSrc={btnImgExpandMore}
              btnImgAlt="arrow-icon" 
              btnText="Adicionar Planta"
          />
        </section>
        <section className="section--toggle">
          <ToggleBtn
              btnId="deleteForm_toggleBtn"
              btnImgId="toggleBtnImgDel"
              btnImgSrc={btnImgExpandLess}
              btnImgAlt="arrow-icon" 
              btnText="Deletar Planta"
          />
        </section>
      </aside>
    </>
  )
}

export default App
