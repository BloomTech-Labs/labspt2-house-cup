import styled from 'styled-components';

const DeleteContainer = styled.div`
        position: fixed;
        top: center;
        left: center;
        background-color: rgb(43, 7, 43,0.8);
        z-index: 2;
        display:flex;       
        flex-direction:column;
        justify-content: center;
        align-items:flex-end;      
        border:1px solid rgba(0,0,0,.65);
        align-items: center;
        width: 280px;
        height: 300px;
        padding: 60px 30px 60px 60px;
        ${'' /* margin:100px auto; */}
        p{
            color: orange;
        }
       .delete {
          
       }
      
       .no-button {
           display:flex;
           flex-direction:column;
           justify-content:center;
           align-items:center;
           width:230px;
           height:38px;
           background:rgb(66, 244, 235,.9);
           padding:12px;
           margin:
           
       }
`

export default DeleteContainer;
