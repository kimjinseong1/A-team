import React, { Component } from 'react';
import {  AgGridReact } from 'ag-grid-react';
import HistoryRecord from '../../services/historyRecord.service'
import Select from "react-select";
import Search from '../../images/search.png'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { FcCalendar } from "react-icons/fc"

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import {Button, Modal,Form, Container, Row } from "react-bootstrap";

import 'bootstrap/dist/css/bootstrap.min.css';

import '../../css/historyRecord.css'

const customStyles = {
  control: base => ({
    ...base,
    height: 28,
    minHeight: 28
  })
};

const time = [{value:0},{value:1},{value:2},{value:3},{value:4},{value:5},{value:6},{value:7},{value:8},{value:9},{value:10},{value:11},{value:12},{value:13}
            ,{value:14},{value:15},{value:16},{value:17},{value:18},{value:19},{value:20},{value:21},{value:22},{value:23}]
const minute = [{value:0},{value:1},{value:2},{value:3},{value:4},{value:5},{value:6},{value:7},{value:8},{value:9},{value:10},{value:11},{value:12},{value:13},{value:14}
,{value:15},{value:16},{value:17},{value:18},{value:19},{value:20},{value:21},{value:22},{value:23},{value:24},{value:25},{value:26},{value:27},{value:28},{value:29},
{value:30},{value:31},{value:32},{value:33},{value:34},{value:35},{value:36},{value:37},{value:38},{value:39},{value:40},{value:41},{value:42},{value:43},{value:44},
{value:45},{value:46},{value:47},{value:48},{value:49},{value:50},{value:51},{value:52},{value:53},{value:54},{value:55},{value:56},{value:57},{value:58},{value:59}]

export default class historyRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarCheckSecond:false,
      calendarCheck:false,
      date: new Date(),
      userDataCheck: false,
      historyModel: false,
      history: [],
      test : [
        { title:'aaa'}
      ],
      columnDefs : [
        { headerName: '사용자', field:'userName' },   // rowGroup:true, width:200
        { headerName: '작업 구분', field:'actionType' },
        { headerName: '메뉴 1', field:'menuDepth1' },
        { headerName: '메뉴 2', field:'menuDepth2' } ,
        { headerName: '매뉴 3', field:'menuDepth3' },
        { headerName: '메뉴 4' , field:'menuDepth4'  },
        { headerName: '작업 대상', field:'targetName'  },
        { headerName: '사용자 IP', field:'settingIp' },
        { headerName: '작업 URL', field:'pageURL' },
        { headerName: '작업 일자', field:'workDate' },
      ],
      defaultColDef: {
        sortable:true,  
        resizable:true,  
        floatingFilter: true,
        filter:'agTextColumnFilter', 
        flex:1,
        maxWidth:210,
      },
      /** user model **/
      userColumnDefs: [ 
        { headerName: '로그인 ID', field:'username', headerCheckboxSelection: true, checkboxSelection:true },
        { headerName: '메일', field:'email'},
        { headerName: '권한', field:'username'},
        { headerName: '로그인 제한', field:'X'},
      ],
      userDefaultColDef: {
        sortable:true, 
        resizable:true,  
        floatingFilter: true,
        filter:'agTextColumnFilter', 
        flex:1,
        maxWidth:210,
      },
      user: [
        { value:"아아ㄴㅁㅇㄴㅁㅇ",label: "Blue"}
      ],
      searchName:[],
      historyActiveArray:[],  
      historyActiveData:['LOGIN','LOGOUT','CREATE','UPDATE','DELETE','ACTIVE','INACTIVE','RESTART','DOWNLOAD'],
      historyActiveList:[],
    }
  }

  componentDidMount() {
    const {historyActiveList,} = this.state;
    const activeData = [{id: 1,value:'LOGIN'},{id: 2,value:'LOGOUT'},{id: 3,value:'CREATE'},{id: 4,value:'UPDATE'},{id: 5,value:'DELETE'}
    ,{id: 6,value:'ACTIVE'},{id: 7,value:'INACTIVE'},{id: 8,value:'RESTART'},{id: 9,value:'DOWNLOAD'}];

    this.setState({
      historyActiveArray:activeData,
      historyActiveList:new Array(activeData.length).fill(true),
    })


    HistoryRecord.getHistoryRecord() 
      .then(res => {
        console.log(res.data);
        this.setState({history:res.data})
      })

    HistoryRecord.getUserHistory()
      .then(res => {
        const data = [];
        res.data.forEach(u=> {
          const obj = {};
          obj.value = u.username;
          obj.label = u.username;
          data.push(obj);
        })
        this.setState({searchName: data})
    })
  }

  historySelect = () => {
    HistoryRecord.getUserHistory()
      .then(res => {
        console.log(res.data);
        const userData = [];
        const data = res.data;
        data.forEach(u => {
          u.roles.forEach(r=> {
            u.role= r.name;
          })
        })
        this.setState({user:res.data,historyModel:true})
      })
  }
  /** user 적용  **/
  historyApply = () => {
    const applyData = this.gridApi.getSelectedRows();
    console.log(applyData);
    const applyUsername= [];
    applyData.forEach(a => {
        const obj = {};
        obj.value = a.username;
        obj.label = a.username;
        applyUsername.push(obj);
    })
    this.setState({searchName: applyUsername, historyModel:false,userDataCheck:true})
  }

  /** 작업 구분 전체  **/
  activeAll = (e) => {
    const {historyActiveList} = this.state;
    const newArray=['LOGIN','LOGOUT','CREATE','UPDATE','DELETE','ACTIVE','INACTIVE','RESTART','DOWNLOAD'];
    const tmpArr=historyActiveList.map((item) => {
      item = e.target.checked ? true:false;
      return item;
    })
    this.setState({historyActiveData: e.target.checked ? newArray: [], historyActiveList:tmpArr,})
  }

  /* 작업 구분 개별 */
  activeEach = (item) => {
  const {historyActiveList,historyActiveData} = this.state;
  var newArray = [...historyActiveData, item.value]
  const changeCheck = historyActiveList.map((check,idx) => {
   if(idx === item.id - 1) check = !check;
   return check;
  });
  
  if(historyActiveData.includes(item.value)) {
    newArray = newArray.filter(o => o !== item.value);
  }
  this.setState({historyActiveList:changeCheck})
  this.setState({historyActiveData:newArray})
 }

 historySelectEvent = () => {
   const { searchName,historyActiveData } = this.state;
   const searchData = [];
   searchName.forEach(s=> {
    searchData.push(s.value);
   })
   console.log(searchData);
   console.log(historyActiveData);
   HistoryRecord.getSelectHistory(searchData,historyActiveData)
    .then(res=> {
      this.setState({history:res.data})
    })
 }


  

  render() {
   const { columnDefs,test, defaultColDef,history,user,historyModel,userColumnDefs,userDefaultColDef,searchName, historyActiveArray,historyActiveData,historyActiveList
    ,userDataCheck,calendarCheck,date, calendarCheckSecond } = this.state;

    console.log(calendarCheck);
    console.log(date);
    console.log(new Date());

    return (
          <div className="historyContainer">
            {/* 상단 */}
            <div className="historyFilterContainer">
              <div className="historyFilterBoxArea">
                  <div className="historyFilterBoxLeft">
                      <div className="historyFilterTitle">
                        <p className="historyFilterText" >사용자</p>
                      </div>
                      <div className="historyFilterSearchArea">
                        <div className="historyFilterSearchBox">
                          <button className="historyFilterSearch" onClick={()=> this.historySelect()} >
                            선택
                            <img src={Search} style={{width:20, padding:1}} />
                          </button>
                          {
                             this.state.historyModel && (
                            <>
                            <Modal show={historyModel} onHide={()=>this.setState({historyModel:false})} dialogClassName="userModel"   >

                            <Modal.Header  className="header-Area">
                                
                            <Modal.Title id="contained-modal-title-vcenter" className="header_Text">
                              유저 목록
                            </Modal.Title>

                            </Modal.Header>
                                <Modal.Body>
                                
                                      <div className="ag-theme-alpine" style={{ width:'43vw', height:'45vh'}}>
                                          <AgGridReact
                                            headerHeight='30'
                                            floatingFiltersHeight='27'
                                            rowHeight='30'
                                            rowData={user} 
                                            columnDefs={userColumnDefs} 
                                            defaultColDef={userDefaultColDef}
                                            rowSelection='multiple'
                                            onGridReady={params => {this.gridApi = params.api;}} 
                                          />        
                                      </div>
                                
                              </Modal.Body>

                              <Form.Group className="historyFooter">
                                  <Button onClick={()=> this.historyApply()} className="historyActiveBtn"  >적용</Button>
                                  <Button onClick={()=> this.setState({historyModel:false})} className="historyhideBtn"  >닫기</Button>
                              </Form.Group>
                              </Modal>
                              </>
                             ) 
                          }
                         
                          <Select 
                          value={userDataCheck ? searchName : null }
                          className="historyUserSelect" 
                          isDisabled={true} 
                          isMulti
                          name="colors"
                          components={{
                            DropdownIndicator: () => null,
                            IndicatorSeparator: () => null
                          }}
                          styles={customStyles}
                          placeholder="검색"
                          />
                        </div>
                      </div>
                  </div>

                  <div className="historyFilterBoxLeftSecond">
                      <div className="historyFilterTitle">
                        <p className="historyFilterTextSecond" >작업 구분</p>
                      </div>
                      <div className="historyFilterSearchArea">
                        <div className="historyFilterInput">
                          <input type="checkbox" checked={historyActiveList.length===historyActiveData.length ? true:false} onChange={(e)=> this.activeAll(e)} />
                          <span className="filterSpan">ALL </span>
                            {
                              historyActiveArray.map((o,i) => (
                                <>
                                <input type="checkbox" checked={historyActiveList[o.id -1]} onChange={(e)=> this.activeEach(o,e.target.checked,e.target.value)} />
                                <span className="filterSpan">{o.value}</span>
                              </>
                              ))
                            }
                        </div>
                      </div>
                  </div>

                  <div className="historyFilterBoxLeftThird">
                      <div className="historyFilterTitle">
                        <p className="historyFilterTextThird" >작업 날짜</p>
                      </div>
                      <div className="historyFilterSearchArea">
                        <div className="calendarAreaYear">
                            <input className="calendarInput" type="text" value="아아" disabled readonly />
                            <button className="calendarIcon" onClick={()=> this.setState({calendarCheck:true})}>
                              <FcCalendar className="calendarIconStyle"  size="20" value={date} />
                            </button>
                        </div>
                        
                        <select className="calendarTimeArea" value={time}  >
                          {time.map(t => 
                            <option value={t.value} selected={t.value}>{t.value}</option>
                            ) }
                        </select>
                        <select className="calendarTimeArea" value={minute}  >
                          {minute.map(t => 
                            <option value={t.value} selected={t.value}>{t.value}</option>
                            ) }
                        </select>
                        <select className="calendarTimeArea" value={minute}  >
                          {minute.map(t => 
                            <option value={t.value} selected={t.value}>{t.value}</option>
                            ) }
                        </select>

                        <p className="DateMiddle">~</p>

                        <div className="calendarAreaYear">
                            <input className="calendarInput" type="text" value="아아" disabled readonly />
                            <button className="calendarIcon" onClick={()=> this.setState({calendarCheckSecond:true})}>
                              <FcCalendar className="calendarIconStyle"  size="20" value={date} />
                            </button>
                        </div>
                        
                        <select className="calendarTimeArea" value={time}  >
                          {time.map(t => 
                            <option value={t.value} selected={t.value}>{t.value}</option>
                            ) }
                        </select>
                        <select className="calendarTimeArea" value={minute}  >
                          {minute.map(t => 
                            <option value={t.value} selected={t.value}>{t.value}</option>
                            ) }
                        </select>
                        <select className="calendarTimeArea" value={minute}  >
                          {minute.map(t => 
                            <option value={t.value} selected={t.value}>{t.value}</option>
                            ) }
                        </select>
                      </div>
                  </div>
              </div>
              {
                calendarCheck && (
                  <>
                   <Calendar className="calendarStyle" calendarType="US" />
                  </>
                ) 
              }
              {
                calendarCheckSecond && (
                  <>
                   <Calendar className="calendarStyleSecond" calendarType="US" />
                  </>
                )
              }

              <div className="historyMiddleSelectBtnSpace">
                  <Button className="historyMiddleSelectBtn" onClick={()=> this.historySelectEvent()}>조회하기</Button>
                  <Button className="historyMiddleReloadBtn" >초기화</Button>
              </div>
            </div>
            {/* 중간*/}
            <div className="historyMiddleContainer"> 
              
            </div>
            {/* 하단 */}
            <div className="historyAggridContainer">
              <div className="histroyExcelArea">
                <Button className="historyExcelText">내보내기</Button>
              </div>
                <div className="ag-theme-alpine" style={{ width:'96vw', height:'55vh',marginLeft:'0.5vw'}}>
                
                  <AgGridReact
                  headerHeight='30'
                  floatingFiltersHeight='23'
                  rowHeight='25'
                  columnDefs={columnDefs}  
                  defaultColDef={defaultColDef}

                  rowData={history}
                //  autoGroupColumnDef={this.state.autoGroupColumnDef }  
                  />
                    
                 
                   
                           
               </div>
            </div>
          </div>


         

        
    );
   
  }
}