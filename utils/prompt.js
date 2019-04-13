let prompt={
  toast:'',
  modal:''
}
prompt.toast=function(title,icon){
  wx.showToast({
    title: title,
    icon:icon?icon:'none',
    duration:2000
  })
}
prompt.modal=function(title,content){
  return new Promise((resolve,reject)=>{
    wx.showModal({
      title: title,
      content: content,
      success(res) {
        if (res.confirm) {
          resolve()
        } else if (res.cancel) {
          reject('拒绝')
        }
      }
    })
  })
}

export default prompt