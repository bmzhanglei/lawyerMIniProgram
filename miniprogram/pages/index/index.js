//index.js
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrl:"https://6c61-lawyer2019-g5cdc-1259263000.tcb.qcloud.la/images/31560057173_.pic_hd.jpg?sign=a76b9425fdf41a1e6e8dbe979ecd16af&t=1560057247"
  },

  onLoad: function() {

    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  },
  bindGetUserInfo(e) {
    
    let userInfo = e.detail.userInfo;
    console.log(userInfo);  
    const db = wx.cloud.database();
    // 查询当前用户所有的 counters
    db.collection('lawyer_test').where({
      user: userInfo.nickName
    }).get({
      success: res => {
        // debugger
        if (res.data.length > 0 && res.data[0].complete){
          wx.navigateTo({
            url: '../test2/test2?nickname=' + userInfo.nickName
          })
        }else{                 
          wx.navigateTo({
            url: '../test/test?nickname=' + userInfo.nickName
          })
        }
        console.log('[数据库] [查询记录] 成功: ', res.data)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err);
      }
    })
  }
})
