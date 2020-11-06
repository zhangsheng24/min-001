// pages/category/index.js
import { request } from '../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧的菜单数据
    leftMenuList: [],
    //右侧商品数据
    rightContent: [],
    //被点击的左侧菜单
    currentIndex: 0,
    //右侧滚动条距离顶部的距离
    scrollTop:0,

  },
  cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1、先判断一下本地存储中有没有旧的数据
    // {time:Date.now(),data:[...]}
    //2.没有旧数据。直接发送新请求
    //3.有旧数据，同时旧的数据也没有过期就是用本地存储的就数据即可

    const Cates = wx.getStorageSync('cates');
    if (!Cates) {
      this.getCates()
    } else {
      // 设置10s的过期时间
      if (Date.now() - Cates.time > 1000 * 10) {
        this.getCates()
      } else {
        this.cates = Cates.data
        let leftMenuList = this.cates.map(v => v.cat_name)
        let rightContent = this.cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }

  },
  //获取分类数据
  getCates() {
    request({
      url: '/categories'
    }).then(res => {
      console.log(res)
      this.cates = res
      wx.setStorageSync('cates', { time: Date.now(), data: this.cates });
      let leftMenuList = this.cates.map(v => v.cat_name)
      let rightContent = this.cates[0].children
      this.setData({
        leftMenuList,
        rightContent
      })
    })
  },
  handleItemTap(e) {
    const { index } = e.currentTarget.dataset
    let rightContent = this.cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop:0,//重新设置右侧内容scroll-view距离顶部的距离
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

  }
})