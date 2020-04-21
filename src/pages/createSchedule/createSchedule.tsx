import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text,Picker,Button } from "@tarojs/components";
import {AtForm,AtInput,AtButton,AtInputNumber} from 'taro-ui'
class CreateSchedule extends Component {
    config: Config = {
        navigationBarTitleText: "首页"
    };
    constructor () {
      super(...arguments)
      this.state = {
        Title: '',
        description:'',
        selector:['不重复','日循环','周循环','月循环'],
        selectorChecked:'不重复',
        count:0,
        startact:'2018-01-01',
        endact:'2018-05-05',
        bancistart: '00:00',
        banciend: '00:00',
        startdate: '2018-04-22',
        enddate:'2018-04-22'
      }
    }
    onChange=e=>{
      this.setState({
        selectorChecked:this.state.selector[e.detail.value]
      })
    }
    onTimeChange =(Timemode,e)  => {
      this.setState({
        [Timemode]: e.detail.value
      })
    }
    onDateChange = (Datemode,e) => {
      this.setState({
        [Datemode]: e.detail.value
      })
    }
    handleChange (inputName,e) {
      this.setState({
        [inputName]:e,
      })
    }
    onSubmit (e) {

      console.log(e)
      Taro.cloud.init()
      console.log(this.state)
        Taro.cloud
          .callFunction({
            name: 'createsche',
            data: {
              title: this.state.title,
              description:this.state.description
            },
          })
          .then(res => {
            console.log(res)
          })
    }
    onReset (event) {
      this.setState({
        Title: '',
        description:''
      })
    }

    render() {
        return (
          <AtForm
            onSubmit={this.onSubmit.bind(this)}
            onReset={this.onReset.bind(this)}
          >
            <AtInput
              name='title'
              title='活动标题'
              type='text'
              placeholder='请输入活动标题'
              value={this.state.Title}
              onChange={this.handleChange.bind(this,'Title')}
            />
            <AtInput
              name='description'
              title='活动描述'
              type='text'
              placeholder='请输入活动描述'
              value={this.state.description}
              onChange={this.handleChange.bind(this,'description')}
            />
            <View className='page-section'>
              <Text>重复模式</Text>
              <View>
                <Picker mode='selector' range={this.state.selector} onChange={this.onChange}>
                  <View className='picker'>
                    当前选择：{this.state.selectorChecked}
                  </View>
                </Picker>
              </View>
            </View>
            <AtInputNumber
              min={0}
              max={10}
              step={1}
              value={this.state.count}
              onChange={this.handleChange.bind(this,'count')}
            />
            <View className='page-section'>
              <Text>活动时间开始</Text>
              <View>
                <Picker mode='date' onChange={this.onDateChange.bind(this,'startact')}>
                  <View className='picker'>
                    {this.state.startact}
                  </View>
                </Picker>
              </View>
              <Text>活动时间结束</Text>
              <View>
                <Picker mode='date' onChange={this.onDateChange.bind(this,'endact')}>
                  <View className='picker'>
                    {this.state.endact}
                  </View>
                </Picker>
              </View>
            </View>
            <View className='page-section'>
              <Text>班次时间开始</Text>
              <View>
                <Picker mode='date' onChange={this.onDateChange.bind(this,'startdate')}>
                  <View className='picker'>
                    当前选择：{this.state.startdate}
                  </View>
                </Picker>
              </View>
              <View>
                <Picker mode='time' onChange={this.onTimeChange.bind(this,'bancistart')}>
                  <View className='picker'>
                    {this.state.bancistart}
                  </View>
                </Picker>
              </View>
            </View>
            <View className='page-section'>
              <Text>班次时间结束</Text>
              <View>
                <Picker mode='date' onChange={this.onDateChange.bind(this,'enddate')}>
                  <View className='picker'>
                    当前选择：{this.state.enddate}
                  </View>
                </Picker>
              </View>
              <View>
                <Picker mode='time'  onChange={this.onTimeChange.bind(this,'banciend')}>
                  <View className='picker'>
                    {this.state.banciend}
                  </View>
                </Picker>
              </View>
            </View>

            <AtButton formType='submit' >提交</AtButton>
            <AtButton formType='reset'>重置</AtButton>
          </AtForm>
            // <View className="index">
            //     <View>
            //         <Text>这里是创建班表页面</Text>
            //         <Text>用户进到这里的时候 store 的 userData 应该已经有东西了</Text>
            //         <Text>保险起见还是做一个检查，若没有的话还是帮他先做个登入</Text>
            //     </View>
            //     <View>
            //         <Text>用户从这个页面可以做这些事情</Text>
            //         <Text>1. 创建新的班表</Text>
            //     </View>
            // </View>
        );
    }
}

export default CreateSchedule as ComponentClass;
