import { useState } from 'react';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import CanteiroForm from './components/Canteiro-form';
import Header from './components/Header';
import ToggleBtn from './components/Toggle-btn';
import AddForm from './components/Add-form';
import DeleteForm from './components/Delete-form';

import headerImage from './assets/saf_bg.png';

// Environmental Variables
const allPlantasUrl = import.meta.env.VITE_API_URL;

function MeuCanteiroApp() {

  // Toggle Forms States
  const [addForm, setAddForm] = useState(false);
  const [delForm, setDelForm] = useState(false);

  // Add Form State
  const [addFormData, setAddFormData] = useState({
    "nomePlanta": "",
    "novoEstrato": "",
    "tempoColheita": "",
    "espacamento": ""
  });

  //Query All Plantas
  const { isLoading, error, data } = useQuery({
    queryKey: ['fetchAllPlantas'],
      queryFn: async () => {
        const response = await fetch(allPlantasUrl)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      },
  })

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

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

  // Onchange AddPlanta Function
  const handleOnChangeAddForm = (e) => {
    const {name, value} = e.target;
    setAddFormData(p => ({
      ...p,
      [name]: value
    }))
  }

  return (
    <>
      <Header
        imgSrc={headerImage}
      />
      <main id="main">
        <CanteiroForm
          allPlantasData={data.plantas}
        />
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
            formData={addFormData}
            onChangeNomeAddForm={handleOnChangeAddForm}
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
            allPlantasData={data.plantas}
          />
        </section>
      </aside>
    </>
  )
}

export default MeuCanteiroApp
