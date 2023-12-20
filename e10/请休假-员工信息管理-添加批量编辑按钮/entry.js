
import React from 'react';
import { regOvProps, appInfo } from '@weapp/utils';
import { asyncImport } from '@weapp/ecodesdk';
import { observable, computed, action, toJS } from "mobx";
import { inject, observer,Provider } from 'mobx-react';

const { publicUrl } = appInfo('@weapp/ecodesdk');

const NewDatePicker = React.lazy(() => asyncImport('${appId}', 'coms/NewDatePicker'));
const CountWorkYearsButton = React.lazy(() => asyncImport('${appId}', 'coms/CountWorkYearsButton'));
const Button = React.lazy(() => asyncImport('${appId}', 'coms/Button'));



class EmployeeManagerStore {
    @observable isEditing = false;
    @observable isWorkYearCounting = false;
    
    @computed get total() {
        return this.price * this.amount;
    }

    @action seIsWorkYearCounting(isCounting){
      this.isWorkYearCounting = isCounting
    }
    @action toggleIsEditing(){
      this.isEditing = !this.isEditing
    }
    tableStore = {};
    tableData = [];
    async saveMemberData(params){
      // 接口文档地址https://apifox.com/apidoc/shared-3acf4ed0-814f-4e30-a490-88f1fd68285f/api-15098996
      // 获取凭证介绍 https://weapp.eteams.cn/sp/opendoc/freepass/5.1/zh_cn/840673319280451584
     let data_1 = await axios({
        method: 'GET',
        url: '/yth/openserver/oauth2/authorize',
        params: {
          corpid: 'a92b92e0e473cc1f084822a8d6b691f0',
          response_type: 'code',
          state: '123456',
        }
      })
      const params_1 = new URLSearchParams();
      params_1.append('app_key', '36a77f00882eadb24ccc47a7b2755367');
      params_1.append('app_secret', 'f3d088f52a181f15aa6760fb025bcd23');
      params_1.append('grant_type', 'authorization_code');
      params_1.append('code', data_1.data.code);
      let data_2 = await axios({
        method: 'POST',
        url: '/yth/openserver/oauth2/access_token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: params_1,
        // data: {
        //   app_key: '36a77f00882eadb24ccc47a7b2755367',
        //   app_secret: 'f3d088f52a181f15aa6760fb025bcd23',
        //   grant_type: 'authorization_code',
        //   code: data_1.data.code
        // }
      })
      let data_3 = await axios({
        method: 'POST',
        url: "/yth/openserver/api/hrm/restful/syncEmployee",
        data: {access_token: data_2.data.accessToken, ...params},
      }).then(res => {
          if(res.data.message.errcode == '0'){
            weappUi.Dialog.message({  
              type: 'success', // type: 'info', 'error', 'success', 'custom'
              content: '保存成功!',
            })
            return;
          }
          
      })
    };
    
}
window.__employeeManagerStore = new EmployeeManagerStore()


regOvProps('weappUi', 'Table', (props) => {
  let {pathname} = window.location
   if(pathname.indexOf("/cusapp/3188992086533844163/cusapp_combination/hrm/hr/employeeManager") !=-1){
     let first_work_date = props.columns?.find((item) => {
       
       return item.dataIndex == "first_work_date"
     })
     if(first_work_date){
       // props.store.requestData()
       __employeeManagerStore.tableData = props.data
       __employeeManagerStore.tableStore = props.store
       first_work_date.bodyRender=(record, options) => {
          return (
                  <React.Suspense fallback={() => {}}>
                    <NewDatePicker  
                      value={props.data[options.row].first_work_date} 
                      allowClear={false}
                      store={__employeeManagerStore}
                      onChange={action(function(value) {
                      
                        props.data[options.row].first_work_date = value
                        props.data.push({})
                        props.data.pop()
                      })}
                    />
                  </React.Suspense>
            )
       }

      // first_work_date.bodyRender = () => {
      //   return 1111
      // }
     }
   
   }
  return props;
}, 0);

regOvProps('weappHrm', 'ComTitleButtons', (props) => {
  let {pathname} = window.location
   if(pathname.indexOf("/cusapp/3188992086533844163/cusapp_combination/hrm/hr/employeeManager") !=-1 
    && props.weId == 'nhmd9p_da2c8q_u1ozxe_km8mzj_ggii3k_nnu1vk'
   ){
     props.children = <>
          <Provider __employeeManagerStore={__employeeManagerStore}>
              <React.Suspense fallback={() => {}}>
                <Button onClick={() => {__employeeManagerStore.toggleIsEditing()}} type="primary">批量编辑</Button>
              </React.Suspense>
              <React.Suspense fallback={() => {}}>
                <Button type="primary" onClick={() => {
                  let list = __employeeManagerStore.tableData?.filter(item => !!item.first_work_date)
                  let _list = list?.map((item) => {
                    return {
                      id: item.id,
                      department: item.department_id,
                      first_work_date: item.first_work_date,
                    }
                  })
                  let params = {
                    data: _list,
                    dataRule: {
                      "employee": "id",
                      "department": "id"
                    }
                  }
                  __employeeManagerStore.saveMemberData(params)
                }}>保存</Button>
            </React.Suspense>
              <React.Suspense fallback={() => {}}>
                  <CountWorkYearsButton
                  ></CountWorkYearsButton>
              </React.Suspense>
          </Provider>
        </>

   }
  return props;
}, 0);