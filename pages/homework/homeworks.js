// pages/homework/homeworks.js
Page({

  /**
   * Page initial data
   */
  data: {
    ListDisplay: 'block',
    CourseDisplay: 'none',
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      status: getApp().globalData.status,
      courseList: getApp().globalData.courseList,
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
  open:function(e){
    var that=this
    /*
    this.setData({
      CourseDisplay:'block',
      ListDisplay: 'none',
    })*/
    let params={
      courseId: e.target.dataset.courseinfo.courseId,
      courseSN: e.target.dataset.courseinfo.courseSN
    }
    let homeworkArr = new Array()
    let url = 'https://www.udoris.cn/course/detail';
    that.post(url,params).then(res=>{
      let courseDetail = res.data.result.courseDetail;
      this.setData({
        homework_courseDetail:courseDetail
      })
      let x = courseDetail.Htime
      let Htime=x.split('@#$%')
      let y = courseDetail.HTitle
      
      let Htitle = y.split('@#$%')
      let z = courseDetail.HContent
      
      let Hcontent = z.split('@#$%')
      for(let i=0;i<Htime.length;i++){
        let item = new Object()
        item.time=Htime[i];
        item.title = Htitle[i];
        item.content = Hcontent[i];
        homeworkArr.push(item)
      }
    }).then(()=>{
      that.setData({
        homeworkArr:homeworkArr,
        CourseDisplay: 'block',
        ListDisplay: 'none',
      })
    })
  },
  close: function () {
    this.setData({
      CourseArray: '',
      CourseDisplay: 'none',
      ListDisplay: 'block',
      teacher: '',
      courseName: ''
    })
  }
})