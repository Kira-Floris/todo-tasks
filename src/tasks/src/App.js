import logo from './logo.svg';
import './App.css';
import React from 'react'

var urls = "http://127.0.0.1:8000/api/"

class App extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      todoList:[],
      activeItem:{
        id: null,
        title: "",
        completed: false,
      },
      editing: false,
    }
    this.fetchTasks = this.fetchTasks.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getCookie = this.getCookie.bind(this)
    this.startEdit = this.startEdit.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.strikeUnstrike = this.strikeUnstrike.bind(this)
  };

  getCookie(name){
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

  componentWillMount(){
    this.fetchTasks()
  };
  fetchTasks(){
    console.log('fetching...')
    fetch(urls.concat("task-list/"))
    .then(response => response.json())
    .then(data => 
      this.setState({
        todoList:data
      }))
  }
  handleChange(e){
    var name = e.target.name
    var value = e.target.value
    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:value
      }
    })
  }
  handleSubmit(e){
    e.preventDefault()
    var url = ""
    var csrftoken = this.getCookie('csrftoken')
    if(this.state.editing==true){
      var pk = this.state.activeItem.id
      var temp = "task-update/".concat(pk).concat("/")
      url = urls.concat(temp)
      this.setState({
        editing:false,
      })
    }else{
      url = urls.concat("task-create/")
    }
    fetch(url,{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body:JSON.stringify(this.state.activeItem),
    }).then((response) => {
      
      this.fetchTasks()
      console.log("task added...")
      this.setState({
        activeItem:{
          id: null,
          title: "",
          completed: false,
        }
      })
    }).catch(function(error){
      console.log("ERROR", error)
    })
    
  }
  startEdit(task){
    this.setState({
      activeItem: task,
      editing: true,
    })
  }
  deleteItem(task){
    var csrftoken = this.getCookie("csrftoken")
    var pk = task.id
    var url = urls.concat("task-delete/").concat(pk).concat("/")
    fetch(url,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          "X-CSRFToken": csrftoken,
        },

      }
      ).then(response => {
        this.fetchTasks()
      })
  }
  strikeUnstrike(task){
    task.completed = !task.completed
    var csrftoken = this.getCookie("csrftoken")
    var pk = task.id
    var url = urls.concat("task-update/").concat(pk).concat("/")
    fetch(url,{
      method:"POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({"completed":task.completed, "title":task.title}),
    }).then(()=>{
      this.fetchTasks()
    }).catch(function(error){
      console.log("ERROR",error)
    })
  }
  render(){
    var tasks = this.state.todoList
    var self = this
    return(
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form id="form" onSubmit={this.handleSubmit}>
              <div className="flex-wrapper">
                <div style={{flex:10}}>
                  <input className="form-control" onChange={this.handleChange} id="title" type="text" name="title" value={this.state.activeItem.title} placeholder="Add Task..."/>
                </div>
                <div style={{flex:2}}>
                  <input className="btn btn-warning" id="submit" type="submit" placeholder="Submit"/>
                </div>
              </div>
              
            </form>
          </div>
          <div id="list-wrapper">
            {tasks.map(function(task, index){
                return(
                  <div key={index} className="task-wrapper flex-wrapper">
                    <div onClick={()=>self.strikeUnstrike(task)} style={{flex:7}} >
                      {task.completed == false ? (
                        <span>{task.title}</span>
                      ) : (
                        <strike>{task.title}</strike>
                      )}
                      
                    </div>
                    <div style={{flex:1}}>
                      <button onClick={()=>self.startEdit(task)} className="btn btn-sm btn-outline-info update">Edit</button>
                    </div>
                    <div style={{flex:1}}>
                      <button onClick={()=>self.deleteItem(task)} className="btn btn-sm btn-outline-dark delete">-</button>
                    </div>
                  </div>
                )
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
