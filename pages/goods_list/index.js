// pages/goods_list/index.js
/**
 * 1.用户上滑页面 滚动条触底 开始加载下一页数据
 *  1.找到滚动条触底事件 微信小程序文档中有
 *  2.判断有没有下一页
 *    1.获取总页数
 *        总页数=Math.ceil(总条数/pagesize)
 *    2.获取当前的页码 pagenum
 *    3.判断一下当前的页码是否大于等于总页数
 *  3.假如没有下一个数据就弹出弹框
 * 
 */
import {request} from '../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:'综合',
        isActive:true
      },
      {
        id:1,
        value:'销量',
        isActive:false
      },
      {
        id:2,
        value:'价格',
        isActive:false
      }
    ],
    goodsList:[]
  },
  QueryParams:{
    query:'',
    cid:'',
    pagenum:1,
    pagesize:10
  },
  totalPages:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.QueryParams.cid=options.cid
    this.getFoodsList()

  },
  getFoodsList(){
    request({
      url:'/goods/search',
      data:this.QueryParams
    }).then(res=>{
      console.log(res)
      const {total}=res
      this.totalPages=Math.ceil(total/this.QueryParams.pagesize)
      console.log(this.totalPages)
      this.setData({
        goodsList:[...this.data.goodsList,...res.goods]
      },()=>{
        //页面一加载，没有调用下拉刷新窗口
        //关闭下拉刷新窗口，如果没有调用下拉刷新的窗口，直接关闭也不会报错
        wx.stopPullDownRefresh()
      })

    })
  },
  tabsItemChange(e){
    const {index}=e.detail
    let {tabs}=this.data
    tabs.forEach((v,i)=>index===i?v.isActive=true:v.isActive=false)
    this.setData({
      tabs
    })
  },
  onReachBottom(){
    if(this.QueryParams.pagenum >= this.totalPages) {
      wx.showToast({
        title:'没有更多了'
      })
    }else{
      this.QueryParams.pagenum++
      this.getFoodsList()
    }
  },
    /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.QueryParams.pagenum=1
    this.setData({
      goodsList:[]
    })
    this.getFoodsList()
    
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})