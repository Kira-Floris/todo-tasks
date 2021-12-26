import {createContext, useState, useEffect} from 'react'
import jwt_decode from 'jwt-decode'
import { useHistory } from 'react-router-dom'

const AuthContext = createContext()

var urls = "http://127.0.0.1:8000/api/"

export default AuthContext

export const AuthProvider = ({children}) => {

    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=>localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)

    const history = useHistory()

    let getCookie = (name)=>{
        var cookieValue = null;
        if(document.cookie && document.cookie !== ''){
          var cookies = document.cookie.split(";");
          for(var i=0; i<cookies.length; i++){
            var cookie = cookies[i].trim();
            if(cookie.substring(0, name.length+1)===(name+'=')){
              cookieValue = decodeURIComponent(cookie.substring(name.length+1));
              break;
            }
          }
        }
        return cookieValue;
      }
    
    let loginUser = async(e) =>{
        e.preventDefault()
        const url = urls.concat("token/")
        let response = await fetch(url,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"username":e.target.username.value, "password":e.target.password.value})
        })
        let data = await response.json()
        if(response.status === 200){
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem("authTokens",JSON.stringify(data))
            history.push('/')
        }else{
            alert("check your email and password")
        }
    };

    let registerUser = async(e)=>{
        e.preventDefault();
        const url = urls.concat("register/");
        let response = await fetch(url,{
            method:"POST",
            headers: {
                "Content-type":"application/json"
            },
            body: JSON.stringify({"username":e.target.username.value,"email":e.target.email.value,"password":e.target.password.value}),
        });
        let data = await response.json();
        if(response.status===200){
            history.push("login/");
        }else{
            alert("error");
        }
    };

    let logoutUser=()=>{
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        history.push('/login')
    }

    let updateToken = async()=>{
        console.log("update token called")
        var csrftoken = getCookie("csrftoken")
        const url = urls.concat("token/refresh/")
        let response = await fetch(url,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({"refresh":authTokens?.refresh}),
        });
        let data = await response.json()
        if(response.status===200){
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens',JSON.stringify(data))
        }else{
            logoutUser()
        }
        if(loading){
            setLoading(false);
        }
    };
    
    let contextData = {
        user:user,
        authTokens: authTokens,
        registerUser:registerUser,
        loginUser:loginUser,
        logoutUser:logoutUser,
    };

    useEffect(()=>{
        if(loading){
            updateToken();
        }
        let fourMinutes = 1000 * 60 * 4
        let interval = setInterval(()=>{
            if(authTokens){
                updateToken()
            }
        }, fourMinutes)
        return ()=>clearInterval(interval)
    }, [authTokens, loading])

    return(
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
