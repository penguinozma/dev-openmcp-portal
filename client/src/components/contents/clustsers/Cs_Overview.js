import React, { Component } from "react";
import { NavLink } from 'react-router-dom';
import CircularProgress from "@material-ui/core/CircularProgress";
import line_chart_sample from './../../../json/line_chart_sample.json'
import { NavigateNext} from '@material-ui/icons';


import {
  SearchState,
  IntegratedFiltering,
  PagingState,
  IntegratedPaging,
  SortingState,
  IntegratedSorting,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  Toolbar,
  SearchPanel,
  TableHeaderRow,
  PagingPanel,
} from "@devexpress/dx-react-grid-material-ui";
import MyResponsiveLine from './../../modules/LineChart';
import SelectBox from './../../modules/SelectBox';

let apiParams = "";
class Cs_Overview extends Component {
  state = {
    rows:"",
    completed: 0,
    reRender : ""
  }

  componentWillMount() {
    const result = {
      menu : "clusters",
      title : this.props.match.params.name
    }
    this.props.menuData(result);
    apiParams = this.props.match.params;
  }

  componentDidMount() {
    //데이터가 들어오기 전까지 프로그래스바를 보여준다.
    this.timer = setInterval(this.progress, 20);
    this.callApi()
      .then((res) => {
        this.setState({ rows: res });
        clearInterval(this.timer);
      })
      .catch((err) => console.log(err));
  }  

  callApi = async () => {
    var param = this.props.match.params.name;
    const response = await fetch(`/clusters/${param}/overview`);
    const body = await response.json();
    return body;
  };

  progress = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 1 });
  };

  render() {
    console.log("Cs_Overview_Render : ",this.state.rows.basic_info);
    return (
      <div>
        <div className="content-wrapper">
          {/* 컨텐츠 헤더 */}
          <section className="content-header">
            <h1>
            Overview
              <small>{this.props.match.params.name}</small>
            </h1>
            <ol className="breadcrumb">
              <li>
                <NavLink to="/dashboard">Home</NavLink>
              </li>
              <li>
                <NavigateNext style={{fontSize:12, margin: "-2px 2px", color: "#444"}}/>
                <NavLink to="/clusters">Clusters</NavLink>
              </li>
              <li className="active">
                <NavigateNext style={{fontSize:12, margin: "-2px 2px", color: "#444"}}/>
                Overview
              </li>
            </ol>
          </section>

          {/* 내용부분 */}
          <section className="content">
          {this.state.rows ? (
            [
            <BasicInfo rowData={this.state.rows.basic_info}/>,
            <div style={{display:"flex"}}>
              <ProjectUsageTop5 rowData={this.state.rows.project_usage_top5}/>
              <NodeUsageTop5 rowData={this.state.rows.node_usage_top5}/>
            </div>,
            <ClusterResourceUsage rowData={this.state.rows.physical_resources}/>
            ]
          ) : (
            <CircularProgress
              variant="determinate"
              value={this.state.completed}
              style={{ position: "absolute", left: "50%", marginTop: "20px" }}
            ></CircularProgress>
          )}
          </section>
        </div>
      </div>
    );
  }
}

class BasicInfo extends Component {
  render(){
    // console.log("BasicInfo:", this.props.rowData.name)
    
    return (
      <div className="content-box">
        <div className="cb-header">BaseicInfo</div>
        <div className="cb-body">
          <div>
            <span>Name : </span>
            <strong>{this.props.rowData.name}</strong>
          </div>
          <div>
            <span>Provider : </span>
            {this.props.rowData.provider}
          </div>
          <div>
            <span>Kubernetes Version : </span>
            {this.props.rowData.kubernetes_version}
          </div>
        </div>
      </div>
    );
  }
}

class ProjectUsageTop5 extends Component {
  state = {
    columns: [
      { name: "name", title: "Name" },
      { name: "usage", title: "Usage" },
    ],
    rows : this.props.rowData.cpu,
  }

  callApi = async () => {
    const response = await fetch(`/clusters/${apiParams}/overview`);
    const body = await response.json();
    return body;
  };
  
  render(){
    const HeaderRow = ({ row, ...restProps }) => (
      <Table.Row
        {...restProps}
        style={{
          cursor: "pointer",
          backgroundColor: "whitesmoke",
          // ...styles[row.sector.toLowerCase()],
        }}
        // onClick={()=> alert(JSON.stringify(row))}
      />
    );

    const onSelectBoxChange = (data) => {
      console.log("onSelectBoxChange", data)
      switch(data){
        case "cpu":
          console.log("cpu")
          // this.setState({rows:this.props.rowData.cpu});

          this.callApi()
          .then((res) => {
            this.setState({ rows: res.project_usage_top5.cpu });
          })
          .catch((err) => console.log(err));

          break;
        case "memory":
          console.log("memory")
          // this.setState({rows:this.props.rowData.memory});

          this.callApi()
          .then((res) => {
            this.setState({ rows: res.project_usage_top5.memory });
          })
          .catch((err) => console.log(err));

          break;
        default:
          this.setState(this.props.rowData.cpu);
      }
    }

    const selectBoxData = [{name:"cpu", value:"cpu"},{name:"memory", value:"memory"}];
    return (
      <div className="content-box col-sep-2">
        <div className="cb-header">
          Project Usage Top5
          <SelectBox rows={selectBoxData} onSelectBoxChange={onSelectBoxChange}></SelectBox>
        </div>
        
        <div className="cb-body table-style">
          {this.state.aaa}
          <Grid
            rows = {this.state.rows}
            columns = {this.state.columns}>

            {/* Sorting */}
            <SortingState
            // defaultSorting={[{ columnName: 'city', direction: 'desc' }]}
            />
            <IntegratedSorting />

            <Table/>
            <TableHeaderRow showSortingControls rowComponent={HeaderRow}/>
          </Grid>
        </div>
      </div>
    );
  }
}




class NodeUsageTop5 extends Component {
  state = {
    columns: [
      { name: "name", title: "Name" },
      { name: "usage", title: "Usage" },
    ],
    rows : this.props.rowData.cpu,
  }

  callApi = async () => {
    const response = await fetch(`/clusters/${apiParams}/overview`);
    const body = await response.json();
    return body;
  };
  
  render(){
    const HeaderRow = ({ row, ...restProps }) => (
      <Table.Row
        {...restProps}
        style={{
          cursor: "pointer",
          backgroundColor: "whitesmoke",
          // ...styles[row.sector.toLowerCase()],
        }}
        // onClick={()=> alert(JSON.stringify(row))}
      />
    );

    const onSelectBoxChange = (data) => {
      console.log("onSelectBoxChange", data)
      switch(data){
        case "cpu":
          console.log("cpu")
          // this.setState({rows:this.props.rowData.cpu});

          this.callApi()
          .then((res) => {
            this.setState({ rows: res.node_usage_top5.cpu });
          })
          .catch((err) => console.log(err));

          break;
        case "memory":
          console.log("memory")
          // this.setState({rows:this.props.rowData.memory});

          this.callApi()
          .then((res) => {
            this.setState({ rows: res.node_usage_top5.memory });
          })
          .catch((err) => console.log(err));

          break;
        default:
          this.setState(this.props.rowData.cpu);
      }
    }

    const selectBoxData = [{name:"cpu", value:"cpu"},{name:"memory", value:"memory"}];
    return (
      <div className="content-box col-sep-2">
        <div className="cb-header">
          Node Usage Top5
          <SelectBox rows={selectBoxData} onSelectBoxChange={onSelectBoxChange}></SelectBox>
        </div>
        
        <div className="cb-body table-style">
          {this.state.aaa}
          <Grid
            rows = {this.state.rows}
            columns = {this.state.columns}>

            {/* Sorting */}
            <SortingState
            // defaultSorting={[{ columnName: 'city', direction: 'desc' }]}
            />
            <IntegratedSorting />

            <Table/>
            <TableHeaderRow showSortingControls rowComponent={HeaderRow}/>
          </Grid>
        </div>
      </div>
    );
  }
}

class ClusterResourceUsage extends Component {
  render(){
    return (
      <div className="content-box">
        <div className="cb-header">Cluster Resource Usage
</div>
        <div className="cb-body">
          <div className="cb-bdoy-content" style={{height:"250px"}}>
            <MyResponsiveLine data={line_chart_sample[0].cpu} ></MyResponsiveLine>
          </div>
          <div className="cb-bdoy-content" style={{height:"250px"}}>
            <MyResponsiveLine data={line_chart_sample[1].memory} ></MyResponsiveLine>
          </div>
          <div className="cb-bdoy-content" style={{height:"250px"}}>
            <MyResponsiveLine data={line_chart_sample[2].network} ></MyResponsiveLine>
          </div>
        </div>
      </div>
    );
  }
}





export default Cs_Overview;

