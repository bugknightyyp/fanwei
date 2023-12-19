import { regOvProps } from '@weapp/utils';
const path = "/sp/odoc/flowForm";
regOvProps('weappUi', 'Button', (props) => {
  try{
    let {pathname} = window.location;
    if(pathname.indexOf(path) != -1) {
      if(props.children === '结束待办'||props.children ==='办理完成' || props.children==='办结') {
        //console.log("进来了：",props);
        let oldOnClick = props.onClick;
        props.onClick = (t) => {
          //  注册按钮点击事件
          let wfsdk = window.weappWorkflow.getFlowPageSDK();
          //  点击后，将签字意见添加到提交参数中
          let remark = '   ' + wfsdk.getSignRemark();
          wfsdk.baseStore.appendSubmitExtParams({'remark':remark});
          oldOnClick(t);
        }
      }
    }
  }catch(e){
    console.log("签字意见默认首航缩进异常，"+e);
  }
  return props;
}, 0);
