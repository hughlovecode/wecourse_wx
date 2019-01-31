// pages/news/news.js
Page({

  /**
   * Page initial data
   */
  data: {
    listTag:'block',
    detailTag:'none'

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that=this;
    let url = 'https://www.udoris.cn/n/news';
    this.get(url).then(res=>{
      let newsList = res.data.result;
      that.setData({
        newsList:newsList
      })
    }).then(()=>{
      console.log(this.data.newsList)
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
  get:function(url){
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: 'GET',
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
  getDetail:function(e){
    var that=this;
    let item = e.currentTarget.dataset.iteminfo;
    console.log(e)
    console.log(item) 
    let url ='https://www.udoris.cn/n/news/detail?id='+item.id;
    this.get(url).then(res=>{
      let detail=res.data.result;
      let str=detail.content;
      let arr=str.split('</p>')
      let len=arr.length;
      for(let i=0;i<arr.length;i++){
        arr[i]=arr[i].replace(/<p>/g,'')
      }
      let newArr=new Array();
      for(let i=0;i<len;i++){
        if(arr[i].indexOf('<br>')>=0){
          arr[i] = arr[i].split('<br>')
        }
      }
      arr.forEach(item=>{
        if(typeof item === 'string'){
          newArr.push(item)
        }else{
          for(let i=0;i<item.length;i++){
            if(item[i] !==''){
            newArr.push(item[i])
            }
          }
        }
      })
      console.log(newArr)
      detail.content=newArr


      that.setData({
        detail:detail
      }) 

    })
    this.setData({
      listTag:'none',
      detailTag:'block'
    })
  },
  back:function(e){
    this.setData({
      listTag: 'block',
      detailTag: 'none'
    })
  }
})