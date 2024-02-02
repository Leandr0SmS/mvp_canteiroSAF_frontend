function DeleteForm() {

    return (
        <form className="form" id="deleteForm">
            <fieldset className="fieldset">
                <legend>Deletar espécies no banco de dados:</legend>
                <section className="form--section">
                    <label htmlFor="delete_select">Nome:</label> 
                    <select id="delete_select" className="input">
                    </select>
                </section>    
            </fieldset>
            <button type="button" className="btn" id="delBtn">Deletar</button>
        </form>
    )
}

export default DeleteForm