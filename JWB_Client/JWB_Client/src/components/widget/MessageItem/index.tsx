import Taro from '@tarojs/taro';
import { View, Image, Button, Text } from '@tarojs/components';
import Component from '../../common/component';
import './index.scss';
import { AtForm, AtInput, AtButton,AtTextarea } from 'taro-ui'
import {getGlobalData, setGlobalData, getLogininfo} from "../../../models/globalData"
// import { empty } from '../../../assets/images/icon'

interface Props {
  id?: number;
  className?: string;
  style?: string;
  distance: Array<any>;
  showdistance: boolean;
  itemData?: {
    demand_id?:string;
    nick_name?:string;
    avatar_url?: string;
    details_info?: Array<any>;
    comment_info?: Array<any>;
    s_aging?: number;
    s_city?: string;
    s_content?: string;
    s_lat?: number;
    s_lon?: number;
    s_nation?: string;
    s_province?: string;
    s_range?: number;
    s_street: string;
    s_street_number?: string;
    s_subtime: string;
    s_type?: number;
    store_name?: string;
  };
}

// {
//   avatar_url?: string;
//   details_info?: Array<any>;
//   s_aging?: number;
//   s_city?: string;
//   s_content?: string;
//   s_lat?: number;
//   s_lon?: number;
//   s_nation?: string;
//   s_province?: string;
//   s_range?: number;
//   s_street: string;
//   s_street_number?: string;
//   s_subtime: string;
//   s_type?: number;
//   store_name?: string;
// }

// [{
//   avatar_url: "1",
//   details_info: [],
//   s_aging: 1,
//   s_city: "汕头市",
//   s_content: "",
//   s_lat: 23.46613,
//   s_lon: 116.75608,
//   s_nation: "中国",
//   s_province: "广东省",
//   s_range: 1,
//   s_street: "文冠路",
//   s_street_number: "文冠路",
//   s_subtime: "1580913183920",
//   s_type: 0,
//   store_name: "",
// }]

interface State {
  demand_id?:string;
  active: number;
  isCommentShow:boolean;
  contentValue?:string;
  placeholderValue?:string;
  replyId?:string;
  submitContent?:string;
  
}




class Tab extends Component<Props, State> {
  prefix = 'w-message-item'

  state: State
  constructor(props) {
    super(props)
    this.state.isCommentShow=true 
    this.state.contentValue="" 
    this.state.placeholderValue="写下你的内容..." 
    this.state.replyId=""
    this.state.submitContent=''
    
  }

  commentShowChange () {
    let flag=!this.state.isCommentShow
    this.setState({
      isCommentShow: flag,
      contentValue: '',
      placeholderValue:"写下你的内容...",
      replyId:'',
      
    })
    
  }

  
  onSubmit (event) {
    console.log(event)

    const date = new Date()
			
    const year = date.getFullYear()        //年 ,从 Date 对象以四位数字返回年份
    const month = date.getMonth() + 1      //月 ,从 Date 对象返回月份 (0 ~ 11) ,date.getMonth()比实际月份少 1 个月
    const day = date.getDate()             //日 ,从 Date 对象返回一个月中的某一天 (1 ~ 31)
    
    const hours = date.getHours()          //小时 ,返回 Date 对象的小时 (0 ~ 23)
    const minutes = date.getMinutes()      //分钟 ,返回 Date 对象的分钟 (0 ~ 59)
    const seconds = date.getSeconds()      //秒 ,返回 Date 对象的秒数 (0 ~ 59) 

    
    const currentDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds

    if(!(this.state.contentValue)||this.state.contentValue==""){
      Taro.showToast({title: '内容不能为空！', icon: 'none'})
    }
    else{
      if(this.state.placeholderValue&&this.state.placeholderValue!='写下你的内容...'){
        this.state.submitContent = this.state.placeholderValue+this.state.contentValue
        //console.log(this.state.contentValue)
        //console.log(this.state.placeholderValue)
        //console.log(this.state.submitContent)
      }else{this.state.submitContent =this.state.contentValue}
      
    Taro.request({
      url: 'https://jwb.comdesignlab.com/SubComment',
      data: {
        u_id: getLogininfo().openid,
        demand_id:this.props.itemData.demand_id,
        comment_content:this.state.submitContent,
        subtime: currentDate,  
        replyId:this.state.replyId,    
      },
      header: {
        'content-type': 'application/json;charset=utf-8',
        'token':getLogininfo().token,
      },
      method: 'POST',
    })
   
    .then(res => {
      console.log(res.data.msg)
        if(res.data.msg == '操作成功！'){
          if(this.props.itemData.s_type==0||this.props.itemData.s_type==1){
          Taro.redirectTo({
            url: `../home/index?submit_id=${1}`
          })}else{
            Taro.redirectTo({
              url: `../home_life/index?submit_id=${1}`
            })
          }
        }else if(res.data.msg == '内容涉及敏感词！'){
          Taro.showToast({title: '内容涉及敏感词！', icon: 'none'})
        }
    })
   }

  }

  onClick(item,e){
    this.setState({
      placeholderValue:'@'+decodeURIComponent(item.c_nick_name)+' : ',
      replyId:item.c_uid
    })
    //console.log(item)
  }

  onReset (event) {
    console.log(event)
  }

  


  render() {
    const { style, className = '' } = this.props


    const goodsInfo = []
    const commentInfo =[]
    let item
    if (this.props.itemData && this.props.distance){
      if(this.props.itemData.details_info){
        for (item in this.props.itemData.details_info){
          goodsInfo.push(this.props.itemData.details_info[item])
        }
      }
      if(this.props.itemData.comment_info){
        for (item in this.props.itemData.comment_info){
          commentInfo.push(this.props.itemData.comment_info[item])
        }
      }


      let goods_str = '#' + this.props.itemData.s_street

      if (this.props.itemData.s_type == 0){
        goods_str += ' 需 '
        for(item in goodsInfo){
          if(goodsInfo[item].goods_name=='其它'){goods_str += '其它,内容如下:'}
          else{goods_str += goodsInfo[item].goods_name + goodsInfo[item].count + "个" + (item == goodsInfo.length-1?'':',')}
        }
        goods_str += '# ' + this.props.itemData.s_content
      }else if (this.props.itemData.s_type == 1){
        goods_str += ' ' + this.props.itemData.store_name + ' 有 '
        for(item in goodsInfo){
          if(goodsInfo[item].goods_name=='其它'){goods_str += '其它,内容如下：'}
          else{
          goods_str += goodsInfo[item].goods_name + goodsInfo[item].count + "元/个" + (item == goodsInfo.length-1?'':',')
          }
        }
        goods_str += '# ' + this.props.itemData.s_content
      }else if (this.props.itemData.s_type == 2{
        goods_str += ' ' + this.props.itemData.store_name + ' 需 '
        for(item in goodsInfo){
          if(goodsInfo[item].goods_name=='其它'){goods_str += '其它服务,内容如下：'}
          else{
          goods_str += goodsInfo[item].goods_name + (item == goodsInfo.length-1?'':',')
          }
        }
        goods_str += '# ' + this.props.itemData.s_content
      }else if (this.props.itemData.s_type == 3){
        goods_str += ' ' + this.props.itemData.store_name + ' 有 '
        for(item in goodsInfo){
          if(goodsInfo[item].goods_name=='其它'){goods_str += '其它服务,内容如下：'}
          else{
          goods_str += goodsInfo[item].goods_name + (item == goodsInfo.length-1?'':',')
          }
        }
        goods_str += '# ' + this.props.itemData.s_content
      }
  
      return <View style={style} className={`${className} ${this.prefix}`}>
        <View className={`${this.prefix}-top-wrap`}>
          {
            this.props.itemData.avatar_url == '' 
            ? <Image src='https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3094462453,75056796&fm=26&gp=0.jpg' className={`${this.prefix}-img`}></Image>
            : <Image src={this.props.itemData.avatar_url} className={`${this.prefix}-img`}></Image>
          }
          <View className={`${this.prefix}-title`}>
            {decodeURIComponent(this.props.itemData.nick_name)}
            <View className={`${this.prefix}-time`}>
              {this.props.itemData.s_subtime}
            </View>
          </View>
          <View className={`${this.prefix}-area`}>
             {this.props.itemData.s_street_number} 
             {this.props.itemData.store_name + ' '} 
             {
               this.props.showdistance?(Math.round(this.props.distance.distance/100)/10).toFixed(1) + ' km': ''
             }
          </View>
        </View>
        <View className={`${this.prefix}-bottom-wrap`}>
          {goods_str}
          <View className={`${this.prefix}-operation`}>
            {this.state.isCommentShow == true && <Text className={`${this.prefix}-comment`} onClick={this.commentShowChange.bind(this)} style="color:black">评论-></Text>}
            {this.state.isCommentShow == false && <Text className={`${this.prefix}-comment`} onClick={this.commentShowChange.bind(this)} style="color:#3D91ED">评论-></Text>}
          </View>
          <View hidden={this.state.isCommentShow} className={`${this.prefix}-comment-area`} style="padding-top:10px">
          {
              
              this.props.itemData.comment_info.map((item, index) => {
                return (
                  <View onClick={this.onClick.bind(this,item)} key = {index} className={`${this.prefix}-commentshow`}>
                    <Image src={item.c_avatar_url} className={`${this.prefix}-img`}></Image>
                    <View className={`${this.prefix}-comment-column`} >
                     <View className={`${this.prefix}-title`} style="display:block" >
                            {decodeURIComponent(item.c_nick_name)}
                            <View style="float:right;color:grey;font-size:10px">{item.c_subtime}</View>
                          
                     </View >
                     <View style="padding-left:12px;width:550rpx;word-wrap:break-word">{item.comment_content}</View>
                    </View>
                  </View>
                )
              })
            }
            
         
          <AtForm className={`${this.prefix}-comment-input`} onSubmit={this.onSubmit.bind(this)} onReset={this.onReset.bind(this)}>
          <View className={`${this.prefix}-comment-inputBox`}>
          <View className={`${this.prefix}-comment-inputField`}>
          <AtTextarea
            count={false} 
            name='value'
            placeholder={this.state.placeholderValue}
            value={this.state.contentValue}
            onChange={(e) => {this.setState({contentValue: e.detail.value})}}
            maxLength={100}
            height={40}
            customStyle={{width:"550rpx",marginRight:"10px"}}

          />
          </View>
          <View style={{display:'flex',alignItems:"center"}}>
           <AtButton className={`${this.prefix}-submit`} formType='submit' size='small' customStyle={{color:"#3D91ED"}}>提交</AtButton>
           </View>
          </View>
          </AtForm>
        </View>
        </View>
        

      </View>
    }
    
  }
}

export default Tab;
