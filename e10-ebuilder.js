window.ebuilderSDK.getPageSDK().on('formReady',  (args) => {
  const weFormSdk = window.WeFormSDK.getWeFormInstance();//获取实例
  try {
    
    weFormSdk.registerCheckEvent(window.WeFormSDK.OPER_SUBMIT, (successFn: Function, failFn: Function) => {
      const qjlx_fileid = weFormSdk.convertFieldNameToId("qjlx");//获取请假类型字段id
      const kxye_fileid = weFormSdk.convertFieldNameToId("sz_65rd");//获取可休余额字段id
      const qjts_fileid = weFormSdk.convertFieldNameToId("qjts");//获取请假天数字段id
      const qjkssj_fileid = weFormSdk.convertFieldNameToId("qjkssj");//请假开始时间字段id
      const qjjssj_fileid = weFormSdk.convertFieldNameToId("qjjssj");//请假结束时间字段id
      const qjlx_value = weFormSdk.getSelectShowName(qjlx_fileid);//获取请假类型显示值
      const kxye_value = weFormSdk.getFieldValue(kxye_fileid)*1;//获取可用余额值
      const qjts_value = weFormSdk.getFieldValue(qjts_fileid)*1;//获取请假天数值
      const qjkssj_value = weFormSdk.getFieldValue(qjkssj_fileid);//获取请假开始时间值
      const qjjssj_value = weFormSdk.getFieldValue(qjjssj_fileid);//获取请假结束时间值

      var startTime = new Date(qjkssj_value);
      var endTime = new Date(qjjssj_value);
      if(startTime.getTime() > endTime.getTime()){
        failFn({code:500, msg: "请假结束时间不能早于请假开始时间!"});
        return;
      }
      if(qjts_value == 0){
          failFn({code:500, msg: "请确认请假天数是否正确！"});
        return;
      }
      
      if(qjlx_value == "年休假" || qjlx_value =="调休" ){
        if(qjts_value > kxye_value){
          failFn({code:500, msg: "当前选择请假天数大于可休余额，请重新选择！"});
          return;
        }
      }
      successFn();
    });
  } catch(e) {
    alert("注册事件异常")
    console.log("页面发生异常:",e)
  }


  // 获取主表字段fieldId
  const qjkssjMark = weFormSdk.convertFieldNameToId("qjkssj");
  const qjkssjdMark = weFormSdk.convertFieldNameToId("qjkssjd");
  const qjkssjfzzdMark = weFormSdk.convertFieldNameToId("qjkssjfzzd");

  const qjjssjMark = weFormSdk.convertFieldNameToId("qjjssj");
  const qjjssjdMark = weFormSdk.convertFieldNameToId("qjjssjd");
  const qjjssjfzzdMark = weFormSdk.convertFieldNameToId("qjjssjfzzd");

   

   function getFieldValueByKey(key){
     const fieldMark = weFormSdk.convertFieldNameToId(key);
     const fieldValue = weFormSdk.getFieldValue(fieldMark);
     return fieldValue
   }
   function getTimeValueById(id){
      // 937252238725808131 全天 937252238725808129 上午； 937252238725808130 下午
     let time;
     switch (id) {
        case 'qt':
          time = getFieldValueByKey('qtsjfzzd')
          break;
        case 'sw':
          time = getFieldValueByKey('swsjfzzd')
          break;
        case 'xw':
          time = getFieldValueByKey('xwsjfzzd')
          break;
        default:
          break;
      }
     return time
   }

  function concatDateTimeStr(data, time){
    if(!data){
      return ''
    }
    if(!time){
      return data
    }
    return `${data} ${time}`
  }

  // 绑定事件，对主表字段和明细表的某一行绑定
  weFormSdk.bindFieldChangeEvent(`${qjkssjMark},${qjkssjdMark},${qjjssjMark},${qjjssjdMark}`, (data) => {
   
      // 取字段标识
      const fieldMark = data.id;
      // 取字段修改的值
      const value = data.value;

      switch (fieldMark) {
        case qjkssjMark:
          weFormSdk.changeFieldValue(qjkssjfzzdMark, {value: concatDateTimeStr(value, getTimeValueById(weFormSdk.getFieldValue(qjkssjdMark)))})
          break;
        case qjkssjdMark:
          weFormSdk.changeFieldValue(qjkssjfzzdMark, {value:  concatDateTimeStr(weFormSdk.getFieldValue(qjkssjMark), getTimeValueById(value))});
          break;
        case qjjssjMark:
          weFormSdk.changeFieldValue(qjjssjfzzdMark, {value: concatDateTimeStr(value, getTimeValueById(weFormSdk.getFieldValue(qjjssjdMark)))});
          break;
        case qjjssjdMark:
          weFormSdk.changeFieldValue(qjjssjfzzdMark, {value: concatDateTimeStr(weFormSdk.getFieldValue(qjjssjMark), getTimeValueById(value))});
          break;
      
        default:
          break;
      }
  });
  // 绑定事件，对主表字段和明细表的某一行绑定
  weFormSdk.bindFieldChangeEvent(`${qjkssjfzzdMark},${qjjssjfzzdMark}`, (data) => {
  
   
      // 取字段标识
      const fieldMark = data.id;
      // 取字段修改的值
      const value = data.value;
  });
});

// 获取表单数据
https://unitytest.sz.gov.cn/yth/api/odoc/form/core/getFormLayout?formId=897161102876331474
