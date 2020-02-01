// pages/provideInfo/provideInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    textLength: 0,


    checkboxItems: [
      { name: '外科用口罩', value: '0' },
      { name: 'N95口罩', value: '1' },
      { name: '普通一次性口罩', value: '2' },
      { name: '医用酒精', value: '3' },
      { name: '84消毒液', value: '4' }
    ],


    date: "2016-09-01",
    time: "12:01",

   


    isAgree: false,
    formData: {

    },
    rules: [{
      name: 'checkbox',
      rules: { required: true, message: '多选列表是必选项' },
    }
    ]
  },


  textCount: function (e) {
    console.log("输入的内容---" + e.detail.value)
    console.log("输入的长度---" + e.detail.value.length)
    this.setData({
      textLength: e.detail.value.length
    })
  },


  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems,
      [`formData.checkbox`]: e.detail.value
    });
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value,
      [`formData.date`]: e.detail.value
    })
  },
  formInputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  bindAccountChange: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);

    this.setData({
      accountIndex: e.detail.value
    })
  },


  bindAgreeChange: function (e) {
    console.log('isAgree发生change事件，isAgree：', e.detail.value.length);
    this.setData({
      isAgree: !!e.detail.value.length
    });

  },

  submitForm() {
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })

        }
      } else {
        wx.showToast({
          title: '校验通过'
        })
      }
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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