import './App.css';
import { ChangeEventHandler, useEffect, useState } from 'react';

interface MenuProps {
    setDifficulty: ChangeEventHandler<HTMLSelectElement> | undefined;
    play: React.MouseEventHandler<HTMLLIElement> | undefined;
}

const Menu = ( {setDifficulty, play}: MenuProps) => {
    return(
        <div id='menu'>
            <label>Difficulty</label>
            <br></br>
            <select id='difficulty' onChange={setDifficulty}>
                <option value='easy'>Easy</option>
                <option value='medium'>Medium</option>
                <option value='hard'>Hard</option>
                <option value='extreme'>Extreme</option>
            </select>
            <ul className='nav'>
                <li className='btn'>
                    Grid
                    <input type="checkbox" id="switch" />
                </li>
                <li className='btn'>
                    Background
                    <input type="checkbox" id="switch" />
                </li>
                <li className='btn' onClick={play}>Play</li>
            </ul>
        </div>
    );
}

export default Menu;