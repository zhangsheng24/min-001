

// 小程序封装类似axios的网络请求
class Axios {
    constructor() {
        this.instance = null
        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager()
        }
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new Axios()
            console.log(this.instance)
        }
        return this.instance
    }

    create() {
        return this
    }
    request(options) {
        //return instance().request(arg) 这个options就是我们的arg对象参数
        const { interceptors } = this

        //实例请求的时候传入的基本配置信息
        const requsetOptions = {

            ...options
        }

        //promise分三种状态pending，fulfilled，rejected

        // promise存储队列，分别放的是请求之前的拦截，正式发起请求，请求响应拦截
        const promiseArr = []
        // 请求拦截器
        promiseArr.push({
            fulfilled: interceptors.request.fulfilled,
            rejected: interceptors.request.rejected
        })

        // 正式发起请求
        promiseArr.push({
            fulfilled: dispatchRequest,
            rejected: null
        })

        // 回调拦截器
        promiseArr.push({
            fulfilled: interceptors.response.fulfilled,
            rejected: interceptors.response.rejected
        })
        // promiseArr放的就是三个对象，依次代表请求之前的拦截，正式发起请求，请求响应拦截
        //拦截对象里面的fulfilled和rejected对应的是传递过来的函数（在api文件中index.js中）
        // console.log(promiseArr)


        //promise对象
       

        //方法2：对 then 进行 promise chain 方式进行调用
        // var p2 = new Promise(function (resolve) {
        //     resolve(100);
        // });
        // p2.then(function (value) {
        //     return value * 2;
        // }).then(function (value) {
        //     return value * 2;
        // }).then(function (value) {
        //     console.log("finally: " + value);//400
        // });
        //最终是400，

         //当Promise的回调函数返回非Promise对象的值时，
        //then和catch都生成一个状态为fulfilled的Promise对象，
        //并把该返回值传入Promise链的下一环节

        //当Promise的回调函数返回值为Promise对象时，
        //生成的Promise对象的状态由被返回的Promise对象决定，
        //传入Promise链下一环节的值也由这个被返回的Promise决定。

        //当Promise的回调函数中抛出错误时，
        //then和catch都生成一个状态为rejected的Promise对象，
        //并把抛出的错误对象传入Promise链的下一环节。
        let p = Promise.resolve(requsetOptions)
        //对于正常下，也就是正常走流程获取到数据
        //一开始的promise将参数requsetOptions给resolve，然后循环第一项的时候也就是第一次then的时候也就是请求拦截的时候
        //返回的是状态为fulfilled的Promise对象，并且将返回值config也就是请求参数传入给下一个then
        //开始循环第二项，p.then()中的函数是dispatchRequest，注意：then(fn)的时候fn会执行哦
        //然后返回一个新的promise对象，那么传入下一个then的时候参数取决于这个新的promise对象resolve的是什么
        //由dispatchRequest我们得知，我们是进行微信的网络请求，然后将请求得到的数据对象resolve了
        //所以循环第三项的时候，也就是第三个then的时候，也就是响应拦截器中的res是数据对象
        //然后响应拦截做了一些处理并返回数据对象
        //最终，我们在js中就可以api('home').then(res)拿到res请求的数据

        //对于不正常的情况下，走reject的时候
        //第一次then的时候不会走第二个错误回调函数，因为let p = Promise.resolve(requsetOptions)，没有reject
        //第二次then的时候，如果请求失败，走reject，
        //第三次then的时候，直接走响应拦截的第二个错误回调函数，并且又return Promise.reject(res.data)
        //最后，在js中就会走catch抛出异常
        promiseArr.forEach(ele => {
            //注意以下两种方式是一样的，一个接收resolve，一个接收reject
            //但是如果我们要进行链式调用，也就是then后面还有then的时候还是用第二种
            /**
             *  p.then(res=>{
                    console.log(res)
                }).catch(err=>{
                    console.log(err)
                })

                p.then((res)=>{
                    console.log(res)
                },(err)=>{
                    console.log(err)
                })
             */
            p = p.then(ele['fulfilled'], ele['rejected'])
        })
        return p



    }
}

class InterceptorManager {
    constructor() {
        this.fulfilled = null
        this.rejected = null
    }

    use(fulfilled, rejected) {
        //拦截器传递过来的函数fulfilled，rejected
        this.fulfilled = fulfilled
        this.rejected = rejected
    }
}

const axios = Axios.getInstance()

const dispatchRequest = function (config) {
    return new Promise((resolve, reject) => {
        wx.request({
            ...config,
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}


export default axios



