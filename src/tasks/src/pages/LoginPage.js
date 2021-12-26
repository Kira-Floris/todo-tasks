import React, {useContext, useEffect} from 'react'
import AuthContext from '../context/AuthContext'

const LoginPage = () => {
    let {loginUser} = useContext(AuthContext);
    let {logoutUser,user, authTokens} = useContext(AuthContext);
    
    
    
    return (
        <div>
            <form className="container" onSubmit={loginUser}>
                <div className="form-group my-2">
                    <label>Username</label>
                    <input type="text" className="form-control" name="username" placeholder="Enter username"/>
                </div>
                <div className="form-group my-2">
                    <label>Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" name="password" placeholder="Password"/>
                </div>
                <button type="submit" className="my-2 btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default LoginPage
