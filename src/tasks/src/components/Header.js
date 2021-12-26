import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import '../App.css';

const Header = () => {
    let {user, logoutUser} = useContext(AuthContext)
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
                <div className="text-center" id="navbarNav">
                    <ul className="navbar-nav list-inline">
                        {user && 
                            <li className="nav-item">
                            <span className="h5 nav-link text-white">Hello, {user.username}</span>
                        </li> 
                        }
                           
                        <li className="nav-item">
                            <Link to="/" className="nav-link text-light h5">Home</Link>
                        </li>
                        {user ? (<span className="h5 nav-link text-white logout" onClick={logoutUser}>Log Out</span>) : 
                        (<li className="nav-item">
                            <Link to="/login" className="nav-link text-light h5">Login</Link>
                        </li>)}
                        <li className="nav-item">
                            <Link to="/register" className="nav-link text-light h5">Register</Link>
                        </li>
                    </ul>
                </div>
            </nav>
            
        </div>
    )
}

export default Header
