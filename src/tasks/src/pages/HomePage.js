import '../App.css';
import React, {useContext, useState, useEffect} from 'react'
import AuthContext from '../context/AuthContext';

var urls = "http://127.0.0.1:8000/api/"

const HomePage = ()=>{
  let {user,authTokens,logoutUser} = useContext(AuthContext);
  let [todoList, setTodoList] = useState([]);
  let [activeItem, setActiveItem] = useState({id:null, title:"", completed:false,user:user.user_id});
  let [editing, setEditing] = useState(false);
  

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
  };
  useEffect(()=>{
    fetchTasks();
  }, []);
  let fetchTasks =async()=>{
    console.log("fetching...");
    let response = await fetch(urls.concat("task-list/"),{
      method: "GET",
      headers:{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + String(authTokens.access),
      }
    } 
    );
    let data = await response.json();
    if(response.status === 200){
      setTodoList(data);
    }else if(response.status===401){
      logoutUser();
    }
  };
  let handleChange=(e)=>{
    var name = e.target.name;
    var value = e.target.value;
    setActiveItem({
      ...activeItem,
      [name]:value,
    });
  };
  let handleSubmit =(e)=>{
    e.preventDefault();
    var url="";
    var method = "";
    var csrftoken = getCookie("csrftoken");
    if(editing===true){
      var pk = activeItem.id;
      method = "PUT";
      var temp = "task-update/".concat(pk).concat("/");
      url = urls.concat(temp);
      setEditing(false);
    }else{
      method = "POST";
      url = urls.concat("task-create/");
    }

    console.log(url);
    console.log(activeItem);
    fetch(url,{
      method:method,
      headers:{
        "Content-Type":"application/json",
        "Authorization": "Bearer " + String(authTokens.access),
        "X-CSRFToken": csrftoken,
      },
      body:JSON.stringify(activeItem),
    }).then((response)=>{
      fetchTasks();
      console.log("task added...");
      setActiveItem({
        id:null, title:"",completed:false, user:user.user_id,
      });
    }).catch(function(error){
      console.log("ERROR", error);
    });
  }; 

  let startEdit=(task)=>{
    setActiveItem(task);
    setEditing(true);
  };
    
  let deleteItem=(task)=>{
    var crsftoken = getCookie("csrftoken");
    var pk = task.id;
    var url = urls.concat("task-delete/").concat(pk).concat("/");
    fetch(url,{
      method:"DELETE",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + String(authTokens.access),
        "X-CSRFToken": crsftoken,
      }
    }).then(response=>{
      fetchTasks();
    });
  };
  let strikeUnstrike=(task)=>{
    task.completed = !task.completed;
    var csrftoken = getCookie("csrftoken");
    var pk = task.id;
    var url = urls.concat("task-update/").concat(pk).concat("/");
    fetch(url,{
      method:"PUT",
      headers:{
        "Content-type":"application/json",
        "Authorization": "Bearer " + String(authTokens.access),
        "X-CSRFToken":csrftoken,
      },
      body:JSON.stringify({"completed":task.completed, "title":task.title,"user":user.user_id}),
    }).then(()=>{
      fetchTasks();
    }).catch(function(error){
      console.log("ERROR: ",error);
    });
  };

  return(
    <div className="container">
      <div id="task-container">
        <div id="form-wrapper">
          <form id="form" onSubmit={handleSubmit}>
            <div className="flex-wrapper">
              <div style={{flex:10}}>
                <input className="form-control" onChange={handleChange} id="title" type="text" name="title" value={activeItem.title} placeholder="Add Task..."/>
              </div>
              <div style={{flex:2}}>
                <input className="btn btn-warning" id="submit" type="submit" placeholder="Submit"/>
              </div>
            </div>
            
          </form>
        </div>
        <div id="list-wrapper">
          {todoList.map(function(task, index){
              return(
                <div key={index} className="task-wrapper flex-wrapper">
                  <div onClick={()=>strikeUnstrike(task)} style={{flex:7}} >
                    {task.completed == false ? (
                      <span>{task.title}</span>
                    ) : (
                      <strike>{task.title}</strike>
                    )}
                    
                  </div>
                  <div style={{flex:1}}>
                    <button onClick={()=>startEdit(task)} className="btn btn-sm btn-outline-info update">Edit</button>
                  </div>
                  <div style={{flex:1}}>
                    <button onClick={()=>deleteItem(task)} className="btn btn-sm btn-outline-dark delete">-</button>
                  </div>
                </div>
              )
          })}
        </div>
      </div>
    </div>
  );
  



};



export default HomePage;
