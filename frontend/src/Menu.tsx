import './App.css';
import { ChangeEventHandler, useEffect, useState } from 'react';

interface MenuProps {
    setDifficulty: ChangeEventHandler<HTMLSelectElement> | undefined;
    play: React.MouseEventHandler<HTMLLIElement> | undefined;
    outline: React.MouseEventHandler<HTMLLIElement> | undefined;
    background: React.MouseEventHandler<HTMLLIElement> | undefined;
}

const Menu = ( {setDifficulty, play, outline, background}: MenuProps) => {
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
                <li className='btn unselectable' onClick={outline}>
                    Piece Outline
                    <input type="checkbox" id="outline" defaultChecked/>
                </li>
                <li className='btn unselectable' onClick={background}>
                    Background
                    <input type="checkbox" id="bkg" defaultChecked/>
                </li>
                <li className='btn' onClick={play}>Play</li>
            </ul>
        </div>
    );
}

export default Menu;