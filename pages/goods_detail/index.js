// pages/goods_detail/index.js
import {request} from '../../request/index'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{}
  },
  goods_info:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {goods_id}=options
    this.getDetail(goods_id)
  },

  getDetail(goods_id){
    request({
      url:'/goods/detail',
      data:{
        goods_id
      }
    }).then(res=>{
      console.log(res)
      this.goods_info=res
      this.setData({
        //小程序推荐：data中只存放标签中药使用的数据，所以不直接把res付给goodsObj
        goodsObj:{
          goods_name:res.goods_name,
          goods_price:res.goods_price,
          //80q.webp格式的图片在部分iPhone中不生效
          //临时自己改，确保后台存在1.webp=>1.jpg
          goods_introduce:res.goods_introduce.replace(/\.webp/g,'.jpg'),
          pics:res.pics
        }
      })
    })
  },

  //点击轮播图 放大预览
  handlePrevewImage(e){
    console.log(e)
    const {url}=e.currentTarget.dataset
    let urls=this.goods_info.pics.map(v=>v.pics_mid)
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },

  //点击加入购物车
  handelCartAdd(){
    let cart=wx.getStorageSync('cart') || [];
    let index=cart.findIndex(v=>v.goods_id === this.goods_info.goods_id)
    if(index === -1){
      //不存在。第一次添加
      this.goods_info.num=1
      this.goods_info.checked=true
      cart.push(this.goods_info)
    }else{
      cart[index].num++
    }
    wx.setStorageSync('cart', cart);
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true//防止用户疯狂点击按钮
    });
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