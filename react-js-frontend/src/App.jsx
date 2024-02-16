import { useEffect, useState } from 'react';

import CanteiroForm from './components/Canteiro-form';
import Header from './components/Header';
import ToggleBtn from './components/Toggle-btn';
import AddForm from './components/Add-form';
import DeleteForm from './components/Delete-form';

import headerImage from './assets/saf_bg.png';

function App() {

  // Toggle Forms States
  const [addForm, setAddForm] = useState(false);
  const [delForm, setDelForm] = useState(false);

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
