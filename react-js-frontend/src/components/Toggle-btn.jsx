import { useState } from 'react';

import btnImgExpandMore from '../assets/expand_more.svg';
import btnImgExpandLess from '../assets/expand_less.svg';

function ToggleBtn({ btnId,
                     btnImgId,
                     btnText,
                    }) {

    // toggle buttons state
    const [toggleForm, setToggleForm] = useState(false);

    //handle toggle click btn
    const handleToggleBtn = () => {
      setToggleForm((t) => !t)
    };

    const imgInfo = {
        src: toggleForm ? btnImgExpandLess : btnImgExpandMore,
        alt: toggleForm ? "Expand less icon" : "Expand more icon"
    }

    return (
        <button 
            type="button" 
            className="toggleFormBtn"
            id={btnId}
            onClick={handleToggleBtn}
        >
            <img 
                id={btnImgId}
                className="toggleBtnImg"
                src={imgInfo.src}
                alt={imgInfo.alt}
            />
            {btnText}
        </button>
    )
}

export default ToggleBtn