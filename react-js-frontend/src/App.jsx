import CanteiroForm from './components/Canteiro-form';
import Header from './components/Header';
import ToggleBtn from './components/Toggle-btn';

import headerImage from './assets/saf_bg.png';

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
              btnText="Adicionar Planta"
          />
        </section>
        <section className="section--toggle">
          <ToggleBtn
              btnId="deleteForm_toggleBtn"
              btnImgId="toggleBtnImgDel"
              btnText="Deletar Planta"
          />
        </section>
      </aside>
    </>
  )
}

export default App
