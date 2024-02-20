function DeleteForm({ toggle, allPlantasData, formData, handleOnChange }) {

    const allPlantasOptions = allPlantasData.map(d => {
        return (
            <option
                key={d.nome_planta}
                value={d.nome_planta}
            >
                {d.nome_planta}
            </option>
        )
    })

    const formClass = toggle
        ? "form show"
        : "form hidden"

    console.log(formData)

    return (
        <form className={formClass} id="deleteForm">
            <fieldset className="fieldset">
                <legend>Deletar espécies no banco de dados:</legend>
                <section className="form--section">
                    <label htmlFor="delete_select">Nome:</label> 
                    <select 
                        id="delete_select" 
                        className="input"
                        value={formData}
                        onChange={handleOnChange}
                    >
                        <option value=""></option>
                        {allPlantasOptions}
                    </select>
                </section>    
            </fieldset>
            <button type="button" className="btn" id="delBtn">Deletar</button>
        </form>
    )
}

export default DeleteForm