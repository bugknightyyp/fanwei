import React from 'react';
import { regOvProps, appInfo } from '@weapp/utils';
import { DatePicker, Button } from "@weapp/ui";
import { observable, computed, action, toJS } from "mobx";
import { inject, observer,Provider } from 'mobx-react';
const { publicUrl } = appInfo('@weapp/ecodesdk');

@inject((stores: any) => {
  window.____stores = stores;
  return {
    employeeManagerStore: stores.employeeManagerStore,
    store: stores.__employeeManagerStore
  }
})
@observer
export default class CountWorkYearsButton extends React.Component {
  componentDidMount(){
  }
  setData =  action((data) => {     
    if(data){
      this.props.employeeManagerStore.memberListStore.data = data
    }  
    
  });
  reCountWorkYear(){
      this.props.store.seIsWorkYearCounting(true);
      axios({
        method: 'POST',
        url: `${publicUrl}/api/hr/userInfo/reCountWorkYear`,
        data: {
          isMobile: false,
        },
      })
       .then((res)  => {
         if(res.data.code == '200'){
            weappUi.Dialog.message({  
              type: 'success', // type: 'info', 'error', 'success', 'custom'
              content: '计算完成!',
            })
            // 刷新 table数据
             // ____stores.employeeManagerStore.memberListStore.asyncList
            let _params = this.props.employeeManagerStore.memberListStore.asyncList
            axios({
              method: _params.method,
              url: `${publicUrl}${_params.url}`,
              data: toJS(_params.params),
            })
            .then((res) => {
               this.setData(res?.data?.data?.data)
            })
           
          }
       })
       .finally(() => {
           this.props.store.seIsWorkYearCounting(false);
       })
    }
  render() {
    return (
      <Button
        type="primary" 
        disabled={this.props.store.isWorkYearCounting}
        onClick={()=>{this.reCountWorkYear()}}
      >{this.props.store.isWorkYearCounting ? '正在计算工龄，请稍等' : '计算工龄'}</Button>
    )
  }
}

