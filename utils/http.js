let http={
  get:'',
  post:''
}
http.get=function(url,type){
  return new Promise((resolve,reject)=>{
    let getUrl;
    if(type===1||type===undefined){
      getUrl ='https://www.udoris.cn'+url;
    }else if(type===2){
      getUrl=url
    }
    wx.request({
      url: getUrl,
      method:'GET',
      success(res){
        resolve(res)
      },
      fail(err){
        reject(err)
      }
    })
  })
}
http.post=function(url,params,type){
  return new Promise((resolve,reject)=>{
    let postUrl;
    if(type===1||type===undefined){
      postUrl ='https://www.udoris.cn'+url
    }else if(type===2){
      postUrl=url
    }
    wx.request({
      url: postUrl,
      method:'POST',
      data:params?params:{},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
        resolve(res)
      },
      fail(err){
        reject(err)
      }
    })
  })
}
export default http