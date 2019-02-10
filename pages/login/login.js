
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


    if (this.data.userId.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'loading',
        duration: 2000
      })
    } else {


      let logIn = new Promise((resolve, reject) => {
        wx.request({
          url: 'https://www.udoris.cn/userInfo/login', // 仅为示例，并非真实的接口地址
          method: 'POST',
          data: {
            userId: this.data.userId,
            password: this.data.password
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            resolve(res)
          },
          fail(res) {
            reject(res)
          }
        })
      })
      logIn.then((res) => {
        let data = res.data;
        if (data.status === '0') {
          wx.showToast({
            title: '欢迎您!',
            icon: 'success',
            success: () => {
              let userInfo = data.result.userInfo
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

        } else if (data.status === '2') {
          wx.showToast({
            title: '请先注册!',
            icon: 'none'
          })
        }
      }).catch((res) => {
        console.log('res')
        wx.showToast({
          title: '服务器好像出了问题',
          icon: 'none'
        })
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