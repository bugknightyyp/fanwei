
import React from 'react';
import { regOvProps, appInfo } from '@weapp/utils';
import { asyncImport } from '@weapp/ecodesdk';
import { observable, computed, action, toJS } from "mobx";
import { inject, observer,Provider } from 'mobx-react';

const { publicUrl } = appInfo('@weapp/ecodesdk'); 

regOvProps('weappUi', 'Table', (props) => {
   let {pathname} = window.location


    function traverseTreeIterative(root, callback) {
      if (root === null) {
        return;
      }
      let stack = [root];
      while (stack.length > 0) {
        let node = stack.pop();
        callback(node)
        if(Array.isArray(node.children)){
          stack.push(...node.children)
        }
        
      }
    }
    function replaceHandle(item) {
      if(item.operateName == '批示'){
        item.operateName = '已阅'
      }
      if( item.text == '传阅需批示' || item.text == '传阅不需批示'){
          item.text = '传阅'
      }
    }

     if(
        (
          pathname.indexOf(`${publicUrl}/odoc`) != -1 
          || pathname.indexOf(`${publicUrl}/sp/odoc`) !=-1 
        )
      && 
        (
          props.weId.endsWith('_acbdwy')
          || props.weId.endsWith('_fe7tgt')
        )
    ){
     
      // let node = toJS(props.data?.[3])
      // if(!node) return

      // let nodeChildren = node?.children || []
      // nodeChildren.forEach()
      
      // props.data.splice(3, 1, {
      //   ...node,
      //   children: nodeChildren,
      // })
      let treeData = {
        children: toJS(props.data)
      }
      traverseTreeIterative(treeData, replaceHandle)
      props.data = treeData.children
   
   }
  return props;
}, 0);