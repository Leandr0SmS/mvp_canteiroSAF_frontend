function AddForm({ toggle }) {

    const formClass = toggle
        ? "form show"
        : "form hidden"

    return (
        <form className={formClass} id="addForm">
                <fieldset className="fieldset">
                    <legend>Adicione espécies no banco de dados:</legend>
                    <section className="form--section">
                        <label htmlFor="nomePlanta">Nome:</label> 
                        <input id="nomePlanta" className="input" type="text"  placeholder="Banana Prata"/>
                    </section>
                    <section className="form--section">
                        <label htmlFor="novoEstrato">Estrato:</label> 
                        <select className="input" id="novoEstrato">
                            <option value=""></option>
                            <option value="baixo">Baixo</option>
                            <option value="medio">Médio</option>
                            <option value="alto">Alto</option>
                            <option value="emergente">Emergente</option>
                        </select>
                    </section>    
                    <section className="form--section">
                        <label htmlFor="tempoColheita">Tempo para colheita (dias):</label>
                        <input id="tempoColheita" className="input" type="number"  placeholder="420"/>
                    </section>
                    <section className="form--section">
                        <label htmlFor="espacamento">Espaçamento entre plantas:</label> 
                        <input id="espacamento" className="input" type="number"  placeholder="3.0"/>
                    </section>    
                </fieldset>
                <button type="button" className="btn" id="addBtn">Adicionar</button>
            </form>
    )
}

export default AddForm