import React, {useContext, useEffect} from 'react';
import AuthContext from '../context/AuthContext';

const RegisterPage = () => {
    let {registerUser} = useContext(AuthContext);

    return (
        <div>
            <form className="container" onSubmit={registerUser}>
                <div className="form-group my-2">
                    <label>Username</label>
                    <input type="text" className="form-control" name="username" placeholder="Enter username"/>
                </div>
                <div className="form-group my-2">
                    <label>Email</label>
                    <input type="email" className="form-control" name="email" placeholder="Enter email"/>
                </div>
                <div className="form-group my-2">
                    <label>Password</label>
                    <input type="password" className="form-control" name="password" placeholder="Password"/>
                </div>
                <button type="submit" className="my-2 btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default RegisterPage