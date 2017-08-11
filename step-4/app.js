import bar from './bar'
import Vue from 'vue'
import AV from 'leancloud-storage'

var APP_ID = 'vLHH1jpHvgCH4LVbvEHq4wCH-gzGzoHsz';
var APP_KEY = 'Vzbx8jED1qaU3D3fU9RHzS69';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});


var app = new Vue({
  el:'#app',
  data: {
    actionType: 'signUp',
    formData: {
      username: '',
      password: ''
    },
    newTodo: '',
    todoList:[]
  },
  created: function(){
    window.onbeforeunload = ()=>{
      let dataString = JSON.stringify(this.todoList)
      window.localStorage.setItem('myTodos',dataString)
    }
    let oldDataString = window.localStorage.getItem('myTodos')
    let oldData = JSON.parse(oldDataString)
    this.todoList = oldData || [] 
   },
  methods:{
    addTodo: function(){
      this.todoList.push({
        title: this.newTodo,
        createdAt: new Date(),
        done: false
      })
      this.newTodo= ''
    }, 
    removeTodo: function(todo){
      let index = this.todoList.indexOf(todo)
      this.todoList.splice(index,1)
    },
    signUp: function () {
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then(function (loginedUser) {
        console.log(loginedUser);
      }, function (error) {
      });
    },
    login: function(){
      AV.User.logIn(this.formData.username,this.formData.password).then(function (loginedUser) {
        console.log(loginedUser);
      }, function (error) {
      });
    }
  } 
})

