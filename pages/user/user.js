// pages/user/user.js
var that=this;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    collected:1,
    hidden:true,
    nocancel:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      status: getApp().globalData.status,
      courseList:getApp().globalData.courseList,
    })
   

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getStudents:function(e){
    let data=e.target.dataset.courseinfo;
    wx.navigateTo({
      url: '/pages/studentsList/studentsList?courseId='+data.courseId+'&courseSN='+data.courseSN,
    })
    
  },
  post:function(url,params){
    return new Promise((resolve,reject)=>{
      wx.request({
        url: url, 
        method: 'POST',
        data: params,
        header: {
          'content-type': 'application/json' 
        },
        success(res) {
          resolve(res)
        },
        fail(res) {
          reject(res)
        }
      })

    })
  },
  getInfo:function(e){
    let data = e.target.dataset.courseinfo;  
    let params={
      courseId:data.courseId,
      courseSN:data.courseSN
    }
    let url ='https://www.udoris.cn/course/detail';
    this.post(url,params).then((res) => {
      let courseDetail=res.data.result.courseDetail
      this.setData({
        detail:courseDetail,
        hidden:false
      })
    }).catch((res)=>{
      console.log(res);
      wx.showToast({
        title: '服务器好像出了问题',
        icon: 'none'
      })

    })
  },
  cancel:function(){
    this.setData({
      hidden:true
    })
  },
/* 学生签到 */
signIn:function(e){
  var that=this;
  let courseInfo=e.currentTarget.dataset.courseinfo;
  let params={
    courseId:courseInfo.courseId,
    courseSN:courseInfo.courseSN
  }
  this.setData({
    tempParams:params
  })
  let classCount;
  let courseSSID;
  let url ='https://www.udoris.cn/course/detail';
  this.post(url,params).then(res=>{
    classCount=res.data.result.courseDetail.classCount;
    courseSSID = res.data.result.courseDetail.courseSSID;
    let status = res.data.result.courseDetail.status;
    this.setData({
      classCount:classCount
    })
    if(status !== '0'){
      that.showTip('老师还没有允许签到哦!')
    }else{
      return that.sSignIn(res.data.result.courseDetail.students,courseSSID)
    }
  })
},
showTip: function (info) {
    wx.showToast({
      title: info,
      icon: 'none'
    })
},
sSignIn:function(students,ssid){
  var that=this;
  var wifiPromise=()=>{return new Promise((resolve,reject)=>{
    //监测wifi
    var _this = this;
    _this.startWifi(_this);
    wx.onGetWifiList(function (res) {
      if(res){
        if (res.wifiList.length) {
          for (let n = 0; n < res.wifiList.length; n++) {
            var s = res.wifiList[n].SSID;
            if (ssid === s) {
              resolve()
            }
            if ((n == res.wifiList.length - 1) && (ssid !== s)) {
              that.showTip('当前位置没有老师创建的热点,签到失败!')
              reject('签到失败')
            }
           // console.log("第" + n + "项：" + res.wifiList[n].SSID);
          }
        } else {
          that.showTip('该版本所用api不支持您的手机,请升级系统')
        }
        
      }else{
        that.showTip('请先打开wifi')
        
      }
    })
    wx.getWifiList()
    //over
  })
  }
  let reqInfo;
  wifiPromise().then(res=>{
    students.forEach(item=>{
      if (item.studentId === getApp().globalData.userId){
        let signInCount=item.signInCount;
        let arrIndex = 0;
        let filterArr = signInCount.filter((item2, index) => {
          if (item2.tag === that.data.classCount) {
            arrIndex = index;
            return item2
          }
        })
        if (filterArr.length > 0) {
          signInCount[arrIndex].isSign = 'true'
        } else {
          let newItem = {
            tag: that.data.classCount,
            isSign: 'true'
          }
          signInCount.push(newItem)
          console.log(signInCount)
        }
        reqInfo=item;
      }
    })
  },res=>{
    if(res !== '签到失败'){
      that.showTip('请先打开wifi')
    }
    return Promise.reject(3)
  }).then(res=>{
    //console.log(that.data.classCount)
    //console.log(reqInfo)
    let url = 'https://www.udoris.cn/course/TSignIn';
    let params = {
      info: reqInfo,
      courseId: that.data.tempParams.courseId,
      courseSN: that.data.tempParams.courseSN
    }
    that.post(url,params).then(res=>{
      if(res.data.status === '0'){
        that.showTip('第'+that.data.classCount+'节课签到成功!')
      }else{
        that.showTip('出现问题了,请稍后再尝试')
      }
    })
    },res => {
      console.log('没打开wifi')
    }).catch(res=>{
      console.log(res)
    })
},
/* wifi相关模块准备 */
  startWifi: function (_this) {
    var that=this;
    wx.startWifi({
      success: function () {
        _this.getList(_this);
      },
      fail: function (res) {
        _this.setData({ startError: res.errMsg });
        that.showTip('请确认是否打开wifi')
      }
    })
  },
  getList: function (_this) {
    //请求获取 Wi-Fi 列表
    wx.getWifiList({
      success: function (res) {
        console.log('成功获得wifi列表')
        console.log(res)
      },
      fail: function (res) {
        _this.setData({ wifiListError: true });
        _this.setData({ wifiListErrorInfo: res.errMsg });
      }
    })
  },    
})