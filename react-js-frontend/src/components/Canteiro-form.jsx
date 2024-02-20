function optionsSelector(data, canteiro_id) {
    return data.map(d => {
        if (canteiro_id === d.estrato) {
            return (
                <option 
                    key={d.nome_planta} 
                    value={d.nome_planta}
                >
                    {d.nome_planta}
                </option>
            )
        }
    }) 
}

function CanteiroForm({ allPlantasData }) {

    return (
        <form className="form">
            <fieldset className="fieldset" id="canteiroForm--fieldset">
                <legend>Selecionar plantas nos estratos:</legend>
                <section className="form--section">
                    <label htmlFor="canteiro_baixo">Baixo:</label>
                    <select className="input canteiro_select" id="canteiro_baixo">
                        <option value=""></option>
                        {optionsSelector(allPlantasData, 'baixo')}
                    </select>
                </section>
                <section className="form--section">
                    <label htmlFor="canteiro_medio">Médio:</label> 
                    <select className="input canteiro_select" id="canteiro_medio">
                        <option value=""></option>
                        {optionsSelector(allPlantasData, 'medio')}
                    </select>
                </section>    
                <section className="form--section">
                    <label htmlFor="canteiro_alto">Alto:</label> 
                    <select className="input canteiro_select" id="canteiro_alto">
                        <option value=""></option>
                        {optionsSelector(allPlantasData, 'alto')}
                    </select>
                </section>
                <section className="form--section">
                    <label htmlFor="canteiro_emergente">Emergente:</label> 
                    <select className="input canteiro_select" id="canteiro_emergente">
                        <option value=""></option>
                        {optionsSelector(allPlantasData, 'emergente')}
                    </select>
                </section>
            </fieldset>
            <button type="button" className="btn" id="canteiroBtn">Criar Canteiro</button>
        </form>
    )
}

export default CanteiroForm