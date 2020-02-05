import Taro, { Component, Config } from '@tarojs/taro'
import dayjs from 'dayjs'
let today=()=>{
    const date = new Date();
    const today = (date.getMonth()+1) + '月' + date.getDate() + '日'
    return today
  };

let week=()=>{
    const date = new Date();
    const day = date.getDay();
    let millisecond = 24 * 60 *60 *1000;
    const minusDay = day !=0 ? day - 1:6;
    const monday = new Date(date.getTime() - (minusDay *millisecond));
    const sunday = new Date(monday.getTime() +  (6 *millisecond));
    const week =  (monday.getMonth()+1) + '月' + monday.getDate() + '日' + '-' + (sunday.getMonth()+1) + '月' + sunday.getDate() + '日'
    return week;
  }
let billMap= (n)=>{
    // console.log('数组：'+JSON.stringify(n))
    const map = new Map();
    n.forEach(function(item){
      item.date = dayjs(item.date.split(' ')[0]).format('YYYY年MM月DD日')
        map.has(item.date) ? map.get(item.date).push(item) : map.set(item.date,[item])
    })
    return [...map.values()]
}  
let show=(msg)=>{
    Taro.showToast({
      title: msg,
      icon: 'none',
      duration: 1000
    })
  }

export{today,week,billMap,show}  