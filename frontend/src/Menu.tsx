import './App.css';
import { useEffect, useState } from 'react';

const Menu = () => {
    return(
        <div className='menu'>
            <label>Difficulty</label>
            <br></br>
            <select>
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
                <li className='btn'>Play</li>
            </ul>
        </div>
    );
}

export default Menu;