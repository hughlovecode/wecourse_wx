import http from './../../utils/http.js'
import prompt from './../../utils/prompt.js'
var app = getApp()
var that = this;
var CODE = ''
Page({
  data: {
    userId: '',
    password: ''
  },

  // 获取输入账号 
  userNameInput: function (e) {
    this.setData({
      userId: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 登录 
  login: function () {

    var that=this
    if (this.data.userId.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'loading',
        duration: 2000
      })
    } else {
      wx.login({
        success(result) {
          if (result.code) {
            let params = {
              code: result.code,
              userId: that.data.userId,
              password: that.data.password
            }
            console.log(params)
            http.post('/userInfo/wxBind', params)
              .then(res => {
                let data = res.data;
                if (data.status === '0') {
                  //登录成功的操作
                  wx.showToast({
                    title: '欢迎您!',
                    icon: 'success',
                    success: () => {
                      console.log(data)
                      let userInfo = data.userInfo
                      getApp().globalData.userId = userInfo.userId;
                      getApp().globalData.userName = userInfo.userName;
                      getApp().globalData.userImg = userInfo.userImg;
                      getApp().globalData.status = userInfo.status;
                      getApp().globalData.courseList = userInfo.courseList;
                      wx.switchTab({
                        url: '../user/user'
                      })
                    }
                  })
                } else if (data.status === '1') {
                  prompt.toast('请先注册')
                } else if (data.status === '3') {
                  prompt.toast('密码错误')
                } else {
                  prompt.toast('失败,请稍后尝试')
                  console.log(res)
                }
              })
              .catch(err => {
                prompt.toast('绑定失败,请稍后尝试')
                console.log(err)
              })

          } else {
            prompt.toast('失败,请稍后再试')
          }
        },
        fail(err) {
          prompt.toast('失败,请稍后再试')
        }
      })

    }
  },
  //注册
  register: function () {
    wx.navigateTo({
      url: '../register/register'
    })
  }
})