function Header({ imgSrc }) {
    
    return (
        <header id="header">
            <img id="header--img" src={imgSrc} alt="Consórcio de plantas"/>
            <h1 id="title">Canteiro Agroflorestal</h1>
        </header>
    )
}

export default Header