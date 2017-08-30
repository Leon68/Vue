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
    todoList:[],
    currentUser:null
  },
  created: function(){
    this.currentUser = this.getCurrentUser()
    if (this.currentUser){
      var query = new AV.Query('AllTodos')
      query.find()
        .then(function(todos){
          console.log(todos)
            .then((todos) => {
              let avAllTodos = todos[0]
              let id = avAllTodos.id
              this.todoList = JSON.parse(avAllTodos.atrributes.content)
              this.todoList.id = id
        },function(error){
          console.log(error)
        })
        })
   },
  methods:{
    saveTodos: function(){
      let dataString = JSON.stringify(this.todoList)
      var AVTodos = AV.Object.extend('AllTodos')
      var avTodos = new AVTodos()
      var acl = new AV.ACL()
      acl.setReadAccess(AV.User.current(),true)
      acl.setWriteAccess(AV.User.current(),true)
      avTodos.set('content', dataString)
      avTodos.setACL(acl)
      avTodos.save().then(function (avTodos){
        console.log('yes')
        console.log(dataString)
      },function(error) {
        console.log('no')
      })
    },
    addTodo: function(){
      this.todoList.push({
        title: this.newTodo,
        createdAt: new Date(),
        done: false
      })
      this.newTodo= ''
      this.saveTodos() 
    }, 
    removeTodo: function(todo){
      let index = this.todoList.indexOf(todo)
      this.todoList.splice(index,1)
      this.saveTodos() 
    },
    signUp: function () {
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then((loginedUser) => {
        this.currentUser = this.getCurrentUser()
      },(error) => {
        alert('注册失败')
      });
    },
    login: function(){
      AV.User.logIn(this.formData.username,this.formData.password).then((loginedUser) => {
        this.currentUser = this.getCurrentUser()
      }, function (error) {
        alert('登录失败')
      });
    },
    getCurrentUser: function() {
      let {id,createdAt,attributes: {username}} = AV.User.current()
      return {id,username,createdAt}
      let current = AV.User.current()
      if(current) {
        let {id,createdAt,attibutes: {username}} =  current
        return {id,username,createdAt}
      }else{
        return null
      }
    },
    logout: function(){
      AV.User.logOut()
      this.currentUser = null 
      window.location.reload()
    }
  } 
})

