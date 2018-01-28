//index.js
//获取应用实例
const app = getApp()
const todoKey = "todoKey"
let todoArr = wx.getStorageSync(todoKey) || []

class todoData {
  constructor(todo, checked) {
    this.todo = todo || "";
    this.checked = checked || false;
  }
}
function setTodoList(todo) {
  wx.setStorage({
    key: todoKey,
    data: todo
  })
}
Page({
  data: {
    finishCount: 10,
    allCount: 11,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    todo: null,
    todos: wx.getStorageSync(todoKey) || [],
    isHidden: 'hidden'

  },

  longTap: function (event) { //长按删除
    let that = this
  
    wx.showModal({
      title: '提示',
      content: '是否关闭待办事项?',
      success: function (res) {
        if (res.confirm) {
          todoArr.splice(event.currentTarget.dataset.index, 1)
          that.setData({
            todos: todoArr,
          })
          setTodoList(todoArr);
          wx.showToast({
            title: '关闭成功',
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
  },
  saveHandle: function (event) { //点击保存
    let that = this;
    if (that.data.todo.trim().length === 0) return;
    todoArr = that.data.todos;
    let todoSource = new todoData(that.data.todo);
    todoArr.push(todoSource);
    this.setData({
      todo: "",
      todos: todoArr,
      isHidden: 'hidden'
    })
    setTodoList(todoArr);

  },

  todoHandle: function (event) {  //保存按钮显示或隐藏
    this.setData({
      todo: event.detail.value,
      isHidden: (event.detail.value.length > 0 ? 'save' : 'hidden')
    })
  },

  checkboxChangeHandle: function (event) {  //CheckBox状态改变
    let that = this;
    let todo = todoArr[event.target.dataset.count];
    todo.checked = !todo.checked;
    todoArr.splice(event.target.dataset.count, 1, todo);
    that.setData({
      todos: todoArr,
    })
    setTodoList(todoArr);

  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
