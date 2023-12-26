function ToggleBtn({ btnId, btnImgId, btnImgSrc, btnImgAlt, btnText }) {
    return (
        <button type="button" className="toggleFormBtn" id={btnId}>
            <img id={btnImgId} className="toggleBtnImg"  src={btnImgSrc} alt={btnImgAlt}/>
            {btnText}
        </button>
    )
}

export default ToggleBtn