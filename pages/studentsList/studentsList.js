// pages/studentsList/studentsList.js
var util = require('../../utils/util.js');
Page({

  /**
   * Page initial data
   */
  data: {
    btnState:false,
    hiddenmodalput:true,
    barwidth:1,
    casArray: ['手动输入', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    reply:false,
    hiddenHomework:true,
    barwidth:0,
    hiddenStudentInfo:true

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      courseId:options.courseId,
      courseSN:options.courseSN
    })
    let params={
      courseId: options.courseId,
      courseSN: options.courseSN
    }
    let url ='https://www.udoris.cn/course/detail';
    this.post(url,params).then(
      (res)=>{
        let courseDetail = res.data.result.courseDetail;
        let students=courseDetail.students;
        this.setData({
          detail:courseDetail,
          students:students,
          studentCount:students.length,
          userImg: getApp().globalData.userImg
        })
        if(courseDetail.status === '0'){
          this.setData({
            btnState:true
          })
        }
        let signCount=0;
        let newClassCount = courseDetail.classCount;
        students.forEach((item)=>{
          /*
          if(item.signInCount.length>=newClassCount+1){
            if (item.signInCount[newClassCount].isSign === 'true'){
              signCount++
            }
          }*/
          for(let i=0;i<item.signInCount.length;i++){
            let temp = item.signInCount[i];
            if(temp.tag ===newClassCount ){
              if(temp.isSign === 'true'){
                signCount++;
                break
              }
            }
          }

        })
        let barwidth = (signCount/students.length)*260;
        this.setData({
          signCount:signCount,
          studentsCount:students.length,
          barwidth:barwidth
        })
        console.log(students)
      }
    ).catch((res)=>{
      wx.showToast({
        title: '服务器好像出了问题',
        icon: 'none'
      })
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

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },
  /* back&&finish&&start按钮 */
  back:function(){
    console.log('click back')
  },
  showTip:function(info){
    wx.showToast({
      title: info,
      icon: 'none'
    })
  },
  finish:function(){
    var that=this;
    let params = {
      courseId: this.data.detail.courseId,
      courseSN: this.data.detail.courseSN
    }
    let url = 'https://www.udoris.cn/course/finishSignIn';
    this.post(url,params).then((res)=>{
      if(res.data.status === '0'){
        wx.showToast({
          title: '已经结束签到',
          icon: 'none',
          success: function () {
            that.setData({
              btnState: false
            })
            that.post('https://www.udoris.cn/course/detail', params).then((res) => {
              that.setData({
                detail: res.data.result.courseDetail
              })
            })
          }
        })
      }
    })
  },
  start:function(){
    console.log('click start')
  },
  /*布置作业 */
  homework:function(){
    this.setData({
      hiddenHomework: false
    })
  },
  /* wifi */
  wifiCancel:function(){
    this.setData({
      hiddenmodalput:true
    })
  },
  wifiConfirm:function(){
    console.log('click wifiConfirm')
    this.setData({
      hiddenmodalput: true
    })
    if(this.data.courseSSID === undefined || this.data.courseSSID === '' ){
      this.showTip('请填写完整')
    }else{
      console.log(this.data.courseSSID)
      this.setSignWeek(this.data.indexValue)
    }
  },
  WifiInput:function(e){
    this.setData({
      courseSSID: e.detail.value
    })

  },
  /* studentInfo学生信息 */
  getStudentInfo:function(e){
    this.setData({
      hiddenStudentInfo: false
    })
    let studentInfo = e.target.dataset.studentinfo;
    let info_name=studentInfo.studentName;
    let info_count=studentInfo.signInCount.length;
    let info_signnum=0;
    studentInfo.signInCount.forEach((item)=>{
        if(item.isSign === 'true'){
          info_signnum++
        }
    })
    this.setData({
      info_name:info_name,
      info_count:info_count,
      info_signnum:info_signnum
    })
    

  },
  cancelStudentInfo:function(){
    this.setData({
      hiddenStudentInfo: true
    })
  },
  /* 签到选择 */
  setSignWeek: function (indexValue) {
    var that=this;
    let params={
      courseId:this.data.detail.courseId,
      courseSN:this.data.detail.courseSN,
      classCount:indexValue,
      courseSSID:this.data.courseSSID
    }
    let url = 'https://www.udoris.cn/course/startSignIn';
    this.post(url,params).then((res)=>{
      if(res.data.status === '0'){
        wx.showToast({
          title: '开始第'+indexValue+'节课的签到',
          icon: 'none',
          success:function(){
            that.setData({
              btnState: true
            })
            that.post('https://www.udoris.cn/course/detail',params).then((res)=>{
              that.setData({
                detail:res.data.result.courseDetail,
                courseSSID:''
              })
            })
          }
        })

      }else{
        console.log('ajax请求出错')
      }
    }).catch((res) => {
      wx.showToast({
        title: '服务器好像出了问题',
        icon: 'none'
      })
    })
  },
  bindCasPickerChange:function(e){
    let index=e.detail.value;
    let indexValue = this.data.casArray[e.detail.value];
    console.log(indexValue);
    if(index === '0'){
      console.log('index',index)
      this.setData({
        reply:true
      })
    }else{
      this.setData({
        indexValue:indexValue,
        hiddenmodalput:false
      })
      //this.setSignWeek(indexValue)
      
    }

  },
  HWeekInput: function (e) {
    this.setData({
      HWeek: e.detail.value
    })
  },
  confirmSignIn:function(){
    //console.log('click confirmSignIn')
    let week=this.data.HWeek;
    console.log(week)
    console.log(typeof week)
    if (week == ''||week==undefined || parseInt(week) <= 0 || (week.indexOf('.')>=0)||(isNaN(week))){
      this.showTip('请不要输入非数字,小数或者负数')
    }else{
      this.setData({
        indexValue: week,
        hiddenmodalput: false,
        reply: false
      })
    }
  },
  cancelSignIn:function(){
    this.setData({
      reply:false
    })
  },
  /* 作业 */
  cancelSetHomework:function(){
    this.setData({
      hiddenHomework:true
    })
  },
  HContentInput: function (e) {
    this.setData({
      HContent: e.detail.value
    })
  },
  HTitleInput:function(e){
    this.setData({
      HTitle: e.detail.value
    })
  },
  confirmSetHomework:function(e){
    this.setData({
      hiddenHomework: true
    })
    if (this.data.HContent === undefined || this.data.HContent === '' || this.data.HTitle === undefined || this.data.HTitle === ''){
      this.showTip('请填写完整')
    }else{
      let time = util.formatTime(new Date());
      let url = 'https://www.udoris.cn/course/setHomework';
      let params = {
        courseId: this.data.detail.courseId,
        courseSN: this.data.detail.courseSN,
        Htime: time,
        HContent: this.data.HContent,
        HTitle: this.data.HTitle
      }
      this.post(url, params).then(res => {
        console.log('here:');
        console.log(res)
        this.showTip('添加成功')
       
      })
    }
  },
  /* 签到与签退 */
  signIn:function(e){
    if(this.data.detail.status === '0'){
      return this.sign(e)
    }else{
      this.showTip('请先点击开始签到')
    }
    
  },
  sign:function(e){
    var that = this;
    let studentInfo = e.target.dataset.studentinfo;
    let signInCount = studentInfo.signInCount;
    let arrIndex = 0;
    console.log(signInCount)
    let filterArr = signInCount.filter((item, index) => {
      if (item.tag === that.data.detail.classCount) {
        arrIndex = index;
        return item
      }
    })
    if (filterArr.length > 0) {
      signInCount[arrIndex].isSign = 'true'
    } else {
      let item = {
        tag: that.data.detail.classCount,
        isSign: 'true'
      }
      signInCount.push(item)
    }
    let url = 'https://www.udoris.cn/course/TSignIn';
    let params = {
      info: studentInfo,
      courseId: this.data.courseId,
      courseSN: this.data.courseSN
    }
    this.post(url, params).then(res => {
      that.post('https://www.udoris.cn/course/detail', params).then((res) => {
        that.setData({
          detail: res.data.result.courseDetail,
          students: res.data.result.courseDetail.students
        })
      })
    })
  },
  signOut:function(e){
    if(this.data.detail.status === '0'){
      var that = this;
      let studentInfo = e.target.dataset.studentinfo;
      let signInCount = studentInfo.signInCount;
      let arrIndex = 0;
      let filterArr = signInCount.filter((item, index) => {
        if (item.tag === that.data.detail.classCount) {
          arrIndex = index;
          return item
        }
      })
      if (filterArr.length > 0) {
        signInCount[arrIndex].isSign = 'false'
      } else {
        let item = {
          tag: that.data.detail.classCount,
          isSign: 'false'
        }
        signInCount.push(item)
      }
      let url = 'https://www.udoris.cn/course/TSignIn';
      let params = {
        info: studentInfo,
        courseId: this.data.courseId,
        courseSN: this.data.courseSN
      }
      this.post(url, params).then(res => {
        that.post('https://www.udoris.cn/course/detail', params).then((res) => {
          that.setData({
            detail: res.data.result.courseDetail,
            students: res.data.result.courseDetail.students
          })
        })
      })

    }else{
      this.showTip('请先点击开始签到')
    }
  }
})