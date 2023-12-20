import React from 'react';
import { DatePicker, Button } from "@weapp/ui";
import { inject, observer,Provider } from 'mobx-react';


@observer
export default class NewDatePicker extends React.Component {
  componentDidMount(){
  }
  render() {
   
    const { value, store } = this.props;
    return (
      store.isEditing ? 
        <div 
          onClick={(e) => {
             e.stopPropagation();
         }}
        >
          <DatePicker {...this.props} /> 
        </div>: <span>{value}</span>
    )
  }
}