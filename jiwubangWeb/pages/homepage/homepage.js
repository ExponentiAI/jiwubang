// pages/homepage/homepage.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    tabs: [],
    activeTab: 0,
    tabActiveTextColor: '#78a1ec',
    tabInactiveTextColor: '#78a1ec',
    tabUnderlineColor: '#78a1ec', 
    list: [{
      "text": "信息求助",
      "iconPath": "/icons/一级图标1.png",
      "selectedIconPath": "/icons/一级图标1.png",
      "switchToPage": "../requireInfo/requireInfo",
    },
    {
      "text": "信息提供",
      "iconPath": "/icons/一级图标2.png",
      "selectedIconPath": "/icons/一级图标2.png",
      "switchToPage": "../provideInfo/provideInfo",
    }]

  },

  tabChange(e) {
    console.log('tab change', e)
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const titles = ['热门', '最新', '我的']
    const tabs = titles.map(item => ({ title: item }))
    this.setData({ tabs })

    
  },
 


  onTabCLick(e) {
    const index = e.detail.index
    this.setData({ activeTab: index })
  },

  onChange(e) {
    const index = e.detail.index
    this.setData({ activeTab: index })
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

  }
})