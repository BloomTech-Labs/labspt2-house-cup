import React, { Component } from 'react';
import Checkout from '../Checkout';
import SideMenu from './SideMenu';
import Payment from './Styles/Payment.js';

class BillingPage extends Component  {
     constructor(props) {
         super(props);
         this.state ={
            member: this.props.member
         }
     }
    
   render(){  
       return (
        
       <div className='billing-page'>
           {/* side page component goes here  */}
               <SideMenu />
           {/* <div className='payment-section'> */}
               <Payment className="payment">
               <h1>House Cup Tracker</h1>
               <span className='payment-premium-ad'>
                   For {this.props.premiumPrice} upgrade to a <b>premium</b> account with unlimited Houses and historical analytics.
               </span>
               <div className='payment-info-box'>
                   <Checkout
                     name={'Historical Analytics'}
                     description={'House Cup'}
                     amount={19}
                     checkMembership = {this.props.checkMembership}
                     member = {this.props.member}
                   />
               </div>
               </Payment>
           {/* </div> */}
       </div>
   )
}
}
export default BillingPage;