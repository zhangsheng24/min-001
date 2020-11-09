import axios from '../utils/request'
import resource from './resource'

const instance = ()=>{
    return axios.create()
}

//请求拦截处理
axios.interceptors.request.use(
    config => {
    //   const jwtToken = getStorage('jwtToken')
    //   if (jwtToken) {
    //     config.header['jwtToken'] = jwtToken
    //   }
      return config
    },
    err => {
      return Promise.reject(err)
    }
  )
  //请求响应处理
  axios.interceptors.response.use(
    res => {
      if (res.data.meta.status === 200) {
        return res.data.message
      } else {
        // if (res.data.code === 4030) {
        //   console.log('jwtToken失效')
        //   remStorage('jwtToken')
        //   let pages = getCurrentPages()
        //   if (pages.length) {
        //     const currPage = pages[pages.length - 1]
        //     getApp().login(() => {
        //       currPage.onLoad()
        //       currPage.onShow()
        //     })
        //   }
        // }
        return Promise.reject(res.data)
      }
    },
    err => {
      return Promise.reject(err)
    }
  )

export default function(name,data={},other={}){
    try{
        const arg={
            method:'GET',
            url:'',
            data,
            header: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            ...other
        }
        if(name.slice(0,4) === 'http'){
            arg.url=name
        }else{
            
            const paths=name.split('.')
            let apiArgs=resource
            paths.forEach(item=>{
                if(typeof apiArgs === 'undefined'){
                    throw Error('无对应接口')
                }
                apiArgs=apiArgs[item]
            })
            arg.url=`https://api-hmugo-web.itheima.net/api/public/v1${apiArgs.url}`
            arg.method=apiArgs.method.toLocaleUpperCase()
        }
        

        //如果other中存在params字段的参数，并且是post，就要将参数拼接在url后面
        if(arg.params && arg.method === 'POST'){
            const paramsArray=[]
            Object.keys(arg.params).forEach(key=>paramsArray.push(`${key}=${arg.params[key]}`))
            if(paramsArray.length > 0){
                if(arg.url.indexOf('?') === -1){
                    arg.url+=`?${paramsArray.join('&')}`
                }else{
                    arg.url+=`&${paramsArray.join('&')}`
                }
            }
            delete arg.params
            delete arg.data
        }
        
        return instance().request(arg)
    }catch(err){
        throw Error('请求基础数据缺少', name, error)
    }
}

