function AddForm({ toggle, formData, onChangeNomeAddForm }) {

    const formClass = toggle
        ? "form show"
        : "form hidden"

    console.log(formData)

    return (
        <form className={formClass} id="addForm">
                <fieldset className="fieldset">
                    <legend>Adicione espécies no banco de dados:</legend>
                    <section className="form--section">
                        <label htmlFor="nomePlanta">Nome:</label> 
                        <input 
                            id="nomePlanta" 
                            name="nomePlanta" 
                            className="input" 
                            type="text" 
                            placeholder="Banana Prata"
                            value={formData.nomePlanta}
                            onChange={onChangeNomeAddForm}
                        />
                    </section>
                    <section className="form--section">
                        <label htmlFor="novoEstrato">Estrato:</label> 
                        <select 
                            className="input" 
                            id="novoEstrato"
                            name="novoEstrato"
                            value={formData.novoEstrato}
                            onChange={onChangeNomeAddForm}
                        >
                            <option value=""></option>
                            <option value="baixo">Baixo</option>
                            <option value="medio">Médio</option>
                            <option value="alto">Alto</option>
                            <option value="emergente">Emergente</option>
                        </select>
                    </section>    
                    <section className="form--section">
                        <label htmlFor="tempoColheita">Tempo para colheita (dias):</label>
                        <input 
                            id="tempoColheita" 
                            className="input" 
                            type="number"
                            placeholder="420"
                            name="tempoColheita"
                            value={formData.tempoColheita}
                            onChange={onChangeNomeAddForm}
                        />
                    </section>
                    <section className="form--section">
                        <label htmlFor="espacamento">Espaçamento entre plantas:</label> 
                        <input 
                            id="espacamento"
                            className="input"
                            type="number"
                            placeholder="3.0"
                            name="espacamento"
                            value={formData.espacamento}
                            onChange={onChangeNomeAddForm}    
                        />
                    </section>    
                </fieldset>
                <button type="button" className="btn" id="addBtn">Adicionar</button>
            </form>
    )
}

export default AddForm