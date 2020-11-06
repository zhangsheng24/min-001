
//同时发送异步代码的次数
let ajaxTimes=0
export const request=(params)=>{
    ajaxTimes++
    wx.showLoading({
        title: "加载中",
        mask: true,
    })
    //定义公共的url
    const baseUrl='https://api-hmugo-web.itheima.net/api/public/v1'
    return new Promise((resolve,reject)=>{
        wx.request({
            ...params,
            url:baseUrl+params.url,
            success:(result)=>{
                resolve(result.data.message)
            },
            fail:(err)=>{
                reject(err)
            },
            complete:()=>{
                ajaxTimes-- 
                //比如首页一加载就要请求3个接口，连续调用3次request，一开始ajaxTimes=0
                //然后连续发送三个接口请求，ajaxTimes会++，三个接口，ajaxTimes会变成3，然后接口请求完成又会--，最后变成0
                //为什么会变成3，因为三次请求接口都是同步的方法（this.fn1(),this.fn2()，this.fn3()),而数据请求过程并返回结果是异步的
                if(ajaxTimes === 0){
                    wx.hideLoading();
                }
            }
        })
    })
}