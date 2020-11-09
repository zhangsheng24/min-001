// pages/cart/index.js
import {getSetting,openSetting,chooseAddress} from '../../utils/asyncWx'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allchecked:false,
    totalPrice:0,
    totalNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  async handleChooseAddress(){
    /**
     * 1.假设用户点击获取收货地址提示框 确定  authSetting scope.address 值为true
     *  直接调用 获取收货地址
     * 2.假设用户点击了取消 值为false
     *  诱导用户自己打开授权设置页面，当用户重新给予获取地址的权限的时候，获取收货地址
     * 3.假设用户从来没有调用过收货地址 值为undefined
     */

    //wx.chooseAddress可以获取用户微信的收货地址，前提是要先授权，
    //但是如果用户点击了拒绝，
    //再重新点击按钮去授权就没有反应了
    //解决方案

    //1.获取权限状态
    // wx.getSetting({
    //   success: (result)=>{
    //     console.log(result,'result')
    //     const scopeAddress=result.authSetting['scope.address']
    //     if(scopeAddress === true || scopeAddress=== undefined){
    //       console.log(scopeAddress)
    //       wx.chooseAddress({
    //         success: (result1)=>{
    //             console.log(result1,'result1')
    //         }
    //       });
    //     }else{
    //       //用户拒绝过授权--诱导用户授权
    //       wx.openSetting({
    //         success: (result2)=>{
    //           console.log(result2,'result2')
    //           wx.chooseAddress({
    //             success: (result3)=>{
    //                 console.log(result3,'result3')
    //             }
    //           }); 
    //         },
    //         fail: ()=>{},
    //         complete: ()=>{}
    //       });
    //     }
    //   },
    //   fail: ()=>{},
    //   complete: ()=>{}
    // })
    //上面的代码使用async可以简写成一下代码

    try {
      const res1=await getSetting()
      console.log(res1)
      const scopeAddress=res1.authSetting['scope.address']
      if(scopeAddress === false){
        await openSetting()
      }
      const res2=await chooseAddress()
      
      res2.all=res2.provinceName+res2.cityName+res2.countyName+res2.detailInfo
      wx.setStorageSync('address', res2);
    } catch (error) {
        console.log(error)
    }
    
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
    const address=wx.getStorageSync('address');
    const cart=wx.getStorageSync('cart') || [];
    //[].every()会返回true
    // const allchecked=cart.length?cart.every(v=>v.checked):false
    this.setData({
      address
    })
    this.setCard(cart)

  },
  handleItemChange(e){
    console.log(e)
    const {goods_id}=e.currentTarget.dataset.item
    let {cart}=this.data
    let index=cart.findIndex(v=>v.goods_id === goods_id)
    cart[index].checked=!cart[index].checked
    this.setCard(cart)
  },

  //设置购物车状态，重新计算
  setCard(cart){
    let allchecked=true
    let totalPrice=0
    let totalNum=0
    cart.forEach(v=>{
      if(v.checked){
        totalPrice+=v.num*v.goods_price
        totalNum+=v.num
      }else{
        allchecked=false
      }
    })
    allchecked=cart.length!=0?allchecked:false
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allchecked
    })
    wx.setStorageSync('cart', cart);
  },

  //全选
  handleAllChange(){
    let {cart,allchecked}=this.data
    allchecked=!allchecked
    cart.forEach(v=>v.checked=allchecked)
    this.setCard(cart)

  },

  handleChangeNum(e){
    console.log(e)
    const {id,operation}=e.currentTarget.dataset
    let {cart}=this.data
    const index=cart.findIndex(v=>v.goods_id === id)
    if(cart[index].num === 1 && operation === -1){
      wx.showModal({
        title: '提示',
        content: '您是否要删除？',
        success: (result) => {
          if (result.confirm) {
            cart.splice(index,1)
            this.setCard(cart)
          }
        },
      });
    }else{
      cart[index].num+=operation
      this.setCard(cart)
    }
    
    
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