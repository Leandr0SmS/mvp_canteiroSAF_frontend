function DeleteForm({ toggle, allPlantasData }) {

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

    return (
        <form className={formClass} id="deleteForm">
            <fieldset className="fieldset">
                <legend>Deletar espécies no banco de dados:</legend>
                <section className="form--section">
                    <label htmlFor="delete_select">Nome:</label> 
                    <select id="delete_select" className="input">
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