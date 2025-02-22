import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { StaicDataMaintenance } from '../../shared/constants/constants'
import { ApiService } from 'src/app/service/api.service';
import { FUNDINGREQUESTCONSTANTS } from '../../shared/constants/constants';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { FinanceLimitMaintananceServices } from './finanance-limit-maintanance-service';
import { SmeFinancierForBiddingServices } from '../sme-financefor-bidding/sme-financefor-bidding-service';


@Component({
  selector: 'app-finanance-limit-maintanance',
  templateUrl: './finanance-limit-maintanance.component.html',
  styleUrls: ['./finanance-limit-maintanance.component.scss']
})
export class FinananceLimitMaintananceComponent implements OnInit {
  graphLimit: boolean = true;
  tableLimit: boolean = false;
  limitMaintanceForm: FormGroup;
  newLimitGraphForm: FormGroup;
  countrylimitMaintanceForm: FormGroup;
  mainlimitMaintanceForm: FormGroup;
  groupTooltip = StaicDataMaintenance;
  isEdit: boolean;
  isOk: boolean;
  enableReadonly = true
  newLimit: boolean = true;
  newInitalLimits = [];
  fundingTooltip = FUNDINGREQUESTCONSTANTS;
  overAllLimit;
  smeoverAllLimit;
  countryoverLimitval;
  countrysmeoverAllLimitVal;
  totalExposure: number = 0;
  countrytotalExposure: number = 0;
  isOpen = '';
  bidpanelOpenState
  moment: any = moment;

  displayedColumns: string[] = ['Exposure', 'Modified', 'Available Exposure', 'Created'];
  dataSource: any;


  dataSourceTwo = new MatTableDataSource(); //data
  displayedColumnsTwo: string[] = [
    'sme',
    'country',
    'utilizedAmt',
    'balAmt'
  ];
  dataSourceThree = new MatTableDataSource(); //data
  displayedColumnsThree: string[] = [
    'country',
    'utzAmt',
    'avlAmt'
  ];
  //data source 4 start
  dataSourceFour = new MatTableDataSource();
  displayedColumnsFour: string[] = [
    'smeId',
    'utilPercent',
    'exposureAmt',
    'utilTotlAmt',
    'amtAvailable'
  ];

  //data source 4 end
  //transLimitUtilTableDatas
  public transLimitUtilTableDatas: any = [];
  end = false;
  start = true;
  currentPage = 0;
  pageCount = 1;
  limit = 7;

  //multiple line chart
  // pie chart start
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['25%', '50%', '75%', '100%', 'FULL'];
  public pieChartData: SingleDataSet = [60, 50, 40, 30, 20, 10];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  //pie chart end 

  //horizontal bar start
  public horizontalBarChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public horizontalBarChartLabels = ['25%', '50%', '75%', '100%', 'FULL'];
  public horizontalBarChartType: ChartType = 'bar';
  public horizontalBarChartLegend = true;
  public horizontalBarChartData: ChartDataSets[] = [
    { data: [60, 50, 40, 30, 20, 10], label: 'Series A' },

  ];
  //horizontal bar end

  //line chart start
  chartType = "line";
  chartOptions = {
    responsive: true,
    heigh: 700,
    width: 900
  };
  chartData = [
    { data: [50, 60, 30, 40, 20, 10], label: "Exposure Datas" },
  ];
  chartLabels = ['25%', '50%', '75%', '100%', 'FULL'];
  chartColors = [
    {
      backgroundColor: "rgba(193 55 162 1)",
      borderColor: "rgba(124 73 203 1)",
    },
    {
      backgroundColor: "rgba(193 55 162 1)",
      borderColor: "rgba(124 73 203 1)",
    },
    {
      backgroundColor: "rgba(193 55 162 1)",
      borderColor: "rgba(124 73 203 1)",
    }

  ];
  callPutMethod = false;
  callPostMethod = false;
  callPutMethodEdit: boolean = false;
  mainlimitScreenDatas
  //response LIMIT
  public smetransLimitUtilTableDatas: any = [];
  //response Sector
  public sectorTableDatas: any = [];

  //over_all transaction limt start
  dataSourceOverAllTransactionLimit = new MatTableDataSource(); //data
  displayedColumnsOverAllTransactionLimit: string[] = [
    'invoice',
    'invoicedate',
    'invoiceamount',
    'sme_profile_id',
    'smename',
    'country',
    'sector_description',
    'LIMIT_PERCENT',
    'status'

  ];
  //over_all transaction Limit end 
  //Sme Exposure main start
  dataSourceSmeExposureTable = new MatTableDataSource(); //data
  displayedColumnsSmeExposureTable: string[] = [
    'smename',
    'LIMIT_PERCENT',
    'bidvalue'
  ];
  //sme Exposure main end
  //sector Exposure main start
  dataSourceSectorExposureTable = new MatTableDataSource(); //data
  displayedColumnsSectorExposureTable: string[] = [
    'invoice',
    'invoicedate',
    'invoiceamount',
    'sme_profile_id',
    'smename',
    'country',
    'sector_description',
    'LIMIT_PERCENT',
    'bidvalue',
    'status'

  ];
  //sector Exposure main end
  //country Exposure start
  public countryTableDatas: any = []
  dataSourceCountryExposureTable = new MatTableDataSource(); //data
  displayedColumnsCounrtyExposureTable: string[] = [
    'invoice',
    'invoicedate',
    'invoiceamount',
    'sme_profile_id',
    'smename',
    'country',
    'addresss',
    'sector_description',
    'LIMIT_PERCENT',
    'bidvalue',
    'status'

  ];
  //country Exposure end
  //Buyer Exposure start
  public buyerTableDatas: any = []
  dataSourcebuyerExposureTable = new MatTableDataSource(); //data
  displayedColumnsbuyerExposureTable: string[] = [
    'invoice',
    'invoicedate',
    'invoiceamount',
    'sme_profile_id',
    'smename',
    'country',
    'buyeruen',
    'sector_description',
    'LIMIT_PERCENT',
    'bidvalue',
    'status'

  ];
  //Buyer Exposure end
  // overall Graph representaion
  public OverallhorizontalBarChartData: ChartDataSets[] = [
    { data: [0, 0, 0, 0, 0], label: 'Exposure Datas' },
  ];
  public OverallpieChartData: SingleDataSet = [0, 0, 0, 0, 0];
  public OverallLineData = [
    { data: [0, 0, 0, 0, 0], label: "Exposure Datas" },
  ];
  // overall Graph representaion
  // country Graph representaion
  public countryhorizontalBarChartData: ChartDataSets[] = [
    { data: [0, 0, 0, 0, 0], label: 'Exposure Datas' },
  ];
  public countrypieChartData: SingleDataSet = [0, 0, 0, 0, 0];
  public countryLineData = [
    { data: [0, 0, 0, 0, 0], label: "Exposure Datas" },
  ];
  // country Graph representaion
  // sme Graph representaion
  public smehorizontalBarChartData: ChartDataSets[] = [
    { data: [0, 0, 0, 0, 0], label: 'Exposure Datas' },
  ];
  public smepieChartData: SingleDataSet = [0, 0, 0, 0, 0];
  public smeLineData = [
    { data: [0, 0, 0, 0, 0], label: "Exposure Datas" },
  ];
  // sme Graph representaion
  // sector Graph representaion
  public sectorhorizontalBarChartData: ChartDataSets[] = [
    { data: [0, 0, 0, 0, 0], label: 'Exposure Datas' },
  ];
  public sectorpieChartData: SingleDataSet = [0, 0, 0, 0, 0];
  public sectorLineData = [
    { data: [0, 0, 0, 0, 0], label: "Exposure Datas" },
  ];
  // sector Graph representaion
  // Buyer Graph representaion
  public buyerhorizontalBarChartData: ChartDataSets[] = [
    { data: [0, 0, 0, 0, 0], label: 'Exposure Datas' },
  ];
  public buyerpieChartData: SingleDataSet = [0, 0, 0, 0, 0];
  public buyerLineData = [
    { data: [0, 0, 0, 0, 0], label: "Exposure Datas" },
  ];
  // Buyer Graph representaion
  //globallimit form start
  public globalLimitForm: FormGroup;
  public globalLimitBoolean: boolean = true;
  //globallimit form end
  //counrty limit  form start
  public countryLimitForm: FormGroup;
  public counrtyLimitBoolean: boolean = true;
  //counrty limit form end
  //sme limit  form start
  public smeLimitForm: FormGroup;
  public smeLimitBoolean: boolean = true;
  //counrty limit form end
  //sector limit form start
  public sectorLimitForm: FormGroup;
  public sectorLimitBoolean: boolean = true;
  //sector limit form end
  //buyer limit form start
  public buyerLimitForm: FormGroup;
  public buyerLimitBoolean: boolean = true;
  public getSmeName: any = []

  //sector limit form end
  constructor(public router: Router,
    private fb: FormBuilder, private apiService: ApiService, private datePipe: DatePipe, private toastr: ToastrService, private financelimitMaintananceservices: FinanceLimitMaintananceServices, private SmeFinancierForBiddingServices: SmeFinancierForBiddingServices) {
    this.mainlimitMaintanceFormBuild()
    this.newlimitExposureFormBuild();
    this.groupsFormBuild()
    this.countrylimitMaintanceFormBuild();
    this.globalLimitFormBuild();
    this.countryLimitFormBuild();
    this.smeLimitFormBuild();
    this.sectorLimitFormBuild();
    this.buyerLimitFormBuild();
  }

  ngOnInit(): void {
    this.getsmeNameId()
    this.overallLimitMaintananceGraph();
    this.countryExposureGraph();
    this.smeExposureGraph();
    this.sectorExposureGraph();
    this.buyerExposureGraph();
    this.overAllLimit = this.limitMaintanceForm.value.overAllLimit;
    this.smeoverAllLimit = this.limitMaintanceForm.value.smeoverAllLimit;
    this.countryoverLimitval = this.countrylimitMaintanceForm.value.countryoverAllLimit
    this.countrysmeoverAllLimitVal = this.countrylimitMaintanceForm.value.countrysmeoverAllLimit
    this.limitMaintance();
    this.countrylimitMaintance();
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    this.newlimitExposure();
    this.getMainlimitScreenDatas();
    this.getnewLimitFinSmeDatas();
    this.gettransactionLimitUtilizationTable();
    this.getsmetransLimitUtilTableDatas();
    this.getsectorTableDatas();
    this.getCountryTableDatas();
    this.getBuyerTableDatas();

  }
  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
  }
  getsmeNameId() {
    this.SmeFinancierForBiddingServices.getsmeNameId().subscribe(resp => {
      this.getSmeName = resp;
    })
  }
  //not used yet start
  limitMaintance() {
    this.totalExposure = 0;
    let limitMaintance = [{
      sme: "SME1",
      country: 'SINGAPORE',
      utilizedAmt: 20000,
    }, {
      sme: "SME2",
      country: 'SINGAPORE',
      utilizedAmt: 40000,
    }, {
      sme: "SME3",
      country: 'SINGAPORE',
      utilizedAmt: 4000,
    },
    {
      sme: "SME3",
      country: 'SINGAPORE',
      utilizedAmt: 300,
    }]
    limitMaintance.forEach(element => {
      if (element) {
        this.totalExposure += element.utilizedAmt
        element['balanceAmt'] = this.smeoverAllLimit - element.utilizedAmt
      }
    });
    let totalCalculation = {
      sme: "",
      country: 'Total Exposure',
      utilizedAmt: this.totalExposure,
      balanceAmt: this.overAllLimit - this.totalExposure
    }
    limitMaintance.push(totalCalculation);
    this.dataSourceTwo = new MatTableDataSource(limitMaintance);
  }
  countrylimitMaintance() {
    this.countrytotalExposure = 0;
    let countrylimitMaintance = [{
      country: 'SINGAPORE',
      utzAmt: 20000,
      // balanceAmt: 48000,
    }, {
      country: 'SINGAPORE',
      utzAmt: 40000,
      // avlAmt: 48000,
    }, {
      country: 'SINGAPORE',
      utzAmt: 4000,
      // avlAmt: 48000,
    },
    {
      country: 'SINGAPORE',
      utzAmt: 300,
      // avlAmt: 48000,
    }]
    countrylimitMaintance.forEach(element => {
      if (element) {
        this.countrytotalExposure += element.utzAmt
        element['avlAmt'] = this.countrysmeoverAllLimitVal - element.utzAmt
      }
    });
    let totalCalculation = {
      sme: "",
      country: 'Total Exposure',
      utzAmt: this.countrytotalExposure,
      avlAmt: this.countryoverLimitval - this.countrytotalExposure

    }
    countrylimitMaintance.push(totalCalculation);
    this.dataSourceThree = new MatTableDataSource(countrylimitMaintance);
  }
  changesmelimit(event, type) {
    console.log(event, "event");
    if (type == 'overAllLimit') {
      this.overAllLimit = event.target.value
      this.limitMaintance()
    }
    else if (type == 'smeoverAllLimit') {
      this.smeoverAllLimit = event.target.value
      this.limitMaintance()
    }
  }
  changecountrylimit(event, type) {
    console.log(event, "event");
    if (type == 'overAllLimit') {
      this.countryoverLimitval = event.target.value
      this.countrylimitMaintance()
    }
    else if (type == 'countryoverAllLimit') {
      this.countrysmeoverAllLimitVal = event.target.value
      this.countrylimitMaintance()
    }
  }
  getnewLimitFinSmeDatas() {
    this.financelimitMaintananceservices.getnewLimitFinSmeDatas().subscribe(resp => {
      this.dataSourceFour = new MatTableDataSource(resp);

    })
  }
  newlimitExposure() {
    let newlimitExposure = [{
      name: 'Nike',
      exposure: '97%',
      exposureAmt: '48,500',
      amtAvailable: '1,500'
    }, {
      name: 'Apple',
      exposure: '97%',
      exposureAmt: '48,500',
      amtAvailable: '2,500'
    }, {
      name: 'Finstra',
      exposure: '95%',
      exposureAmt: '47,500',
      amtAvailable: '2,500'
    },
    {
      name: 'Wipro',
      exposure: '95%',
      exposureAmt: '47,500',
      amtAvailable: '2,500'
    }]

    this.dataSourceFour = new MatTableDataSource(newlimitExposure);
  }
  clickadd() {
    this.enableReadonly = false
    var ddatae = new Date();
    let value = this.limitMaintanceForm.value;
    value.created = this.datePipe.transform(ddatae.setDate(ddatae.getDate()))
    value.modified = this.datePipe.transform(ddatae.setDate(ddatae.getDate()))
    console.log(value, "this.limitMaintanceForm.value");
    let array = []
    array.push(value)
    this.dataSource = new MatTableDataSource(array);
    this.limitMaintanceForm.get('modifyExpoOptions').clearValidators();
    this.limitMaintanceForm.get('modifyExposureAmt').clearValidators();
    this.limitMaintanceForm.controls.modifyExpoOptions.enable();
    this.limitMaintanceForm.controls.modifyExposureAmt.enable();
    this.enableReadonly = true;
    this.isEdit = true;
  }
  clickedit() {
    this.enableReadonly = true;
    this.isEdit = true;
    this.isOk = true;
  }
  groupsFormBuild() {
    this.limitMaintanceForm = this.fb.group({
      overAllLimit: [this.mainlimitMaintanceForm.value.mainoverallexposure, Validators.required],
      smeoverAllLimit: [this.mainlimitMaintanceForm.value.mainsmeexposure, Validators.required],
      ccy: ['SGD', Validators.required]
    });
  }
  countrylimitMaintanceFormBuild() {
    this.countrylimitMaintanceForm = this.fb.group({
      countryoverAllLimit: [this.mainlimitMaintanceForm.value.mainoverallexposure, Validators.required],
      countrysmeoverAllLimit: [this.mainlimitMaintanceForm.value.maincountryexposure, Validators.required],
      countryccy: ['SGD', Validators.required]
    });
  }
  //not used yet end


  //dummy form for all exposure start
  newlimitExposureFormBuild() {
    this.newLimitGraphForm = this.fb.group({
      newglobalCcy: ['SGD', Validators.required],
      newglobalLimit: [10000, Validators.required],
      newtransactionLimit: [30000, Validators.required],
      newsmeLimit: [30000, Validators.required]
    });
    this.newInitalLimits = [this.newLimitGraphForm.value.newsmeLimit];
    // this.newsmelimitVal = this.newLimitGraphForm.value.newsmeLimit
  }
  newLimitGraphFormSubmit() {
    this.newLimit = true;
    if (this.newLimitGraphForm.value && this.newLimitGraphForm.status == "VALID") {
      if (this.newLimitGraphForm.value.newsmeLimit != this.newInitalLimits[0]) {
        alert("SME Limit has changed from" + ' ' + this.newInitalLimits[0] + ' ' + "to" + ' ' + this.newLimitGraphForm.value.newsmeLimit)
        this.toastr.success("SME limit successfully updated")
      }
    } else {
      this.newLimit = false;
      this.toastr.error("Please Fill Mandatory fields")
    }
  }
  newLimitFn() {
    this.newLimit = false;
  }
  onSubmitLimitForm() {
    this.isOk = false;
    if (this.limitMaintanceForm.value && this.limitMaintanceForm.status == "VALID") {
      var ddatae = new Date();
      let value = this.limitMaintanceForm.value;
      value.created = this.datePipe.transform(ddatae.setDate(ddatae.getDate()))
      console.log(value, "this.limitMaintanceForm.value");
      let array = []
      array.push(value)
      this.dataSource = new MatTableDataSource(array);
    } else {
      this.isOk = true;
      this.toastr.error("Please Fill Mandatory fields")
    }
  }
  //dummy form for all exposure end


  //main Screen dependency start
  getMainlimitScreenDatas() {
    this.financelimitMaintananceservices.getMainlimitScreenDatas().subscribe(resp => {
      if (resp) {
        //edit flow
        this.mainlimitScreenDatas = resp;
        this.mainlimitMaintanceForm.patchValue({
          mainoverallexposure: resp.overallLimit,
          mainsmeexposure: resp.smewiseMaxlimit,
          maincountryexposure: resp.countryMaxLimit,
          mainsector: resp.sectorLimit,
          transactions: resp.transactions,
          buyerLimit: resp.buyerLimit,
          mainOverallAvailable: resp.OverallAvailable
        });
        this.limitMaintanceForm.patchValue({
          overAllLimit: resp.overallLimit,
          smeoverAllLimit: resp.smewiseMaxlimit,
        });
        this.countrylimitMaintanceForm.patchValue({
          countryoverAllLimit: resp.overallLimit,
          countrysmeoverAllLimit: resp.countryMaxLimit,
        });
        //forms start set edit field
        this.globalLimitFormBuild();
        this.countryLimitFormBuild()
        this.smeLimitFormBuild();
        this.sectorLimitFormBuild();
        this.buyerLimitFormBuild();
        //form end  set edit field
        this.callPutMethodEdit = true;

      } else {
        this.callPostMethod = true;
      }
    })
  }
  callPutMethodEditFn(value) {
    if (value == 'edit') {
      this.callPutMethodEdit = false;
      this.callPutMethod = true
    }
    else {
      this.getMainlimitScreenDatas()
    }
  }
  mainlimitMaintanceFormBuild() {
    this.mainlimitMaintanceForm = this.fb.group({
      mainoverallexposure: ['', Validators.required],
      maincountryexposure: ['', Validators.required],
      mainsmeexposure: ['', Validators.required],
      mainOverallAvailable: [''],
      mainlimitccy: ['SGD', Validators.required],
      mainsector: ['', Validators.required],
      transactions: ['', Validators.required],
      buyerLimit: ['', Validators.required]

    });
  }
  mainlimitMaintanceFormSubmit() {
    if (this.mainlimitMaintanceForm.valid) {
      this.overAllLimit = this.mainlimitMaintanceForm.value.mainoverallexposure;
      this.countryoverLimitval = this.mainlimitMaintanceForm.value.mainoverallexposure;
      this.groupsFormBuild()
      this.countrylimitMaintanceFormBuild();
      this.limitMaintance();
      this.countrylimitMaintance();
      if ((Number(this.mainlimitMaintanceForm.value.mainoverallexposure) <= Number(this.mainlimitMaintanceForm.value.maincountryexposure)) &&
        (Number(this.mainlimitMaintanceForm.value.mainoverallexposure) <= Number(this.mainlimitMaintanceForm.value.mainsmeexposure)) &&
        (Number(this.mainlimitMaintanceForm.value.mainoverallexposure) <= Number(this.mainlimitMaintanceForm.value.mainsector)) &&
        (Number(this.mainlimitMaintanceForm.value.mainoverallexposure) <= Number(this.mainlimitMaintanceForm.value.transactions)) &&
        (Number(this.mainlimitMaintanceForm.value.mainoverallexposure) <= Number(this.mainlimitMaintanceForm.value.buyerLimit))) {
        this.toastr.error("Country,SME,Sector,Transaction and Buyer Limit Amount should not exceeds or equal to the Global Limit");
        return false;
      } else if (Number(this.mainlimitMaintanceForm.value.mainoverallexposure) <= Number(this.mainlimitMaintanceForm.value.maincountryexposure)) {
        this.toastr.error("Country Limit Amount should not exceeds or equal to the Global Limit");
        return false;
      } else if (Number(this.mainlimitMaintanceForm.value.mainoverallexposure) <= Number(this.mainlimitMaintanceForm.value.mainsmeexposure)) {
        this.toastr.error("SME Limit Amount should not exceeds or equal to the Global Limit")
        return false;
      }
      else if (Number(this.mainlimitMaintanceForm.value.mainoverallexposure) <= Number(this.mainlimitMaintanceForm.value.mainsector)) {
        this.toastr.error("Sector Limit Amount should not exceeds or equal to the Global Limit");
        return false;
      }
      else if (Number(this.mainlimitMaintanceForm.value.mainoverallexposure) <= Number(this.mainlimitMaintanceForm.value.transactions)) {
        this.toastr.error("Transaction Limit Amount should not exceeds or equal to the Global Limit");
        return false;
      }
      else if (Number(this.mainlimitMaintanceForm.value.mainoverallexposure) <= Number(this.mainlimitMaintanceForm.value.buyerLimit)) {
        this.toastr.error("Buyer Limit Amount should not exceeds or equal to the Global Limit");
        return false;
      }
      else {
        this.globalLimitFormBuild();
        this.countryLimitFormBuild();
        this.smeLimitFormBuild();
        this.sectorLimitFormBuild();
        this.buyerLimitFormBuild();
        let userCred = JSON.parse(localStorage.getItem('userCred'))
        if (this.callPostMethod) {
          let postdatas = {
            "financierID": userCred['financierProfileId'],
            "overallLimit": this.mainlimitMaintanceForm.value.mainoverallexposure,
            "OverallAvailable": this.mainlimitMaintanceForm.value.mainoverallexposure,
            "OverallUtilizedLimit": 0,
            "smewiseMaxlimit": this.mainlimitMaintanceForm.value.mainsmeexposure,
            "smeWiseUtilized": 0,
            "countryMaxLimit": this.mainlimitMaintanceForm.value.maincountryexposure,
            "CountryWiseUtilized": 0,
            "sectorLimit": this.mainlimitMaintanceForm.value.mainsector,
            "transactions": this.mainlimitMaintanceForm.value.transactions,
            "buyerLimit": this.mainlimitMaintanceForm.value.buyerLimit,
            "LimitAudit": null,
            "limitNumber": "3553-6736-3636-0036"
          }
          this.financelimitMaintananceservices.postnewMainLimitForm(postdatas).subscribe(resp => {
            this.toastr.success("Limit Maintanance Created Successfully");
            this.getMainlimitScreenDatas()
          })
        } else {
          let puttdatas = {
            // OverallAvailable,OverallUtilizedLimit,smeWiseUtilized,CountryWiseUtilized
            "financierID": userCred['financierProfileId'],
            "overallLimit": this.mainlimitMaintanceForm.value.mainoverallexposure,
            "OverallAvailable": this.mainlimitScreenDatas.OverallAvailable,
            "smewiseMaxlimit": this.mainlimitMaintanceForm.value.mainsmeexposure,
            "countryMaxLimit": this.mainlimitMaintanceForm.value.maincountryexposure,
            "sectorLimit": this.mainlimitMaintanceForm.value.mainsector,
            "transactions": this.mainlimitMaintanceForm.value.transactions,
            "buyerLimit": this.mainlimitMaintanceForm.value.buyerLimit,
            "LimitAudit": null,
            "limitNumber": "3553-6736-3636-0036"
          }
          this.financelimitMaintananceservices.putnewMainLimitForm(puttdatas).subscribe(resp => {
            this.toastr.success("Limit Maintanance Updated Successfully");
            this.getMainlimitScreenDatas()
            this.callPutMethodEdit = true
          })

        }
      }
    } else {
      this.toastr.error("Please Fill All the Fields");
      return false;
    }
  }

  //main Screen dependency end

  //global Limit and Transaction start forms and submit
  globalLimitFormBuild() {
    this.globalLimitForm = this.fb.group({
      globallimitccy: ['SGD', Validators.required],
      globalLimit: [this.mainlimitMaintanceForm.value.mainoverallexposure],
      globaltransactionLimit: [this.mainlimitMaintanceForm.value.transactions, Validators.required],
    });
  }
  globalLimitFormSubmit() {
    console.log(this.mainlimitMaintanceForm.value.mainoverallexposure, "this.mainlimitMaintanceForm.value.mainoverallexposure")
    if (this.globalLimitForm.value && this.globalLimitForm.status == "VALID") {
      if (Number(this.mainlimitMaintanceForm.value.mainoverallexposure) > Number(this.globalLimitForm.value.globaltransactionLimit)) {
        if (Number(this.mainlimitMaintanceForm.value.transactions) != Number(this.globalLimitForm.value.globaltransactionLimit)) {
          this.globalLimitBoolean = true;
          alert("Transaction Limit has changed from" + ' ' + this.mainlimitMaintanceForm.value.transactions + ' ' + "to" + ' ' + this.globalLimitForm.value.globaltransactionLimit)
          this.toastr.success("Transaction limit successfully updated")
          this.mainlimitMaintanceForm.patchValue({
            transactions: this.globalLimitForm.value.globaltransactionLimit,
          });
        } else {
          this.toastr.error("Could not update ,the transaction limit remain's same")
        }
      } else {
        this.toastr.error("Transaction Limit Amount should not exceeds or equal to the Global Limit")
      }
    } else {
      this.globalLimitBoolean = false;
      let availableData = 'Please fix the following:,' + 'Global Limit is required,OverAll Limit is required';
      let desiredData = this.replaceCommaLine(availableData);
      console.log(desiredData, "desiredDatas")
      this.toastr.error(desiredData, '', {
        timeOut: 4000, progressBar: true, enableHtml: true
      });
    }
  }
  replaceCommaLine(data) {
    let dataToArray = data.split(',').map(item => item.trim());
    return dataToArray.join("</br>");
  }
  globalLimitflipFlop(value) {
    if (value == 'edit') {
      this.globalLimitBoolean = false;
    } else {
      this.globalLimitBoolean = true;
      this.globalLimitForm.patchValue({
        globaltransactionLimit: this.mainlimitMaintanceForm.value.transactions,
      });
    }
  }
  //global Limit and Transaction end

  //country Exposure start forms and submit
  countryLimitFormBuild() {
    this.countryLimitForm = this.fb.group({
      countrylimitccy: ['SGD', Validators.required],
      globalLimit: [this.mainlimitMaintanceForm.value.mainoverallexposure],
      counrtyLimit: [this.mainlimitMaintanceForm.value.maincountryexposure, Validators.required],
    });
  }
  countryLimitFormSubmit() {
    if (this.countryLimitForm.value && this.countryLimitForm.status == "VALID") {
      if (Number(this.mainlimitMaintanceForm.value.mainoverallexposure) > Number(this.countryLimitForm.value.counrtyLimit)) {
        if (Number(this.mainlimitMaintanceForm.value.maincountryexposure) != Number(this.countryLimitForm.value.counrtyLimit)) {
          this.counrtyLimitBoolean = true;
          alert("Country Limit has changed from" + ' ' + this.mainlimitMaintanceForm.value.maincountryexposure + ' ' + "to" + ' ' + this.countryLimitForm.value.counrtyLimit)
          this.toastr.success("Country limit successfully updated")
          this.mainlimitMaintanceForm.patchValue({
            maincountryexposure: this.countryLimitForm.value.counrtyLimit,
          });
        } else {
          this.toastr.error("Could not update ,the Country limit remain's same")
        }
      } else {
        this.toastr.error("Country Limit Amount should not exceeds or equal to the Global Limit")
      }
    } else {
      this.toastr.error("Please Fill Mandatory fields")
    }
  }
  countryLimitflipFlop(value) {
    if (value == 'edit') {
      this.counrtyLimitBoolean = false;
    } else {
      this.counrtyLimitBoolean = true;
      this.countryLimitForm.patchValue({
        counrtyLimit: this.mainlimitMaintanceForm.value.maincountryexposure,
      });
    }
  }
  //country Exposure end forms and submit


  //sme Exposure start forms and submit
  smeLimitFormBuild() {
    this.smeLimitForm = this.fb.group({
      smelimitccy: ['SGD', Validators.required],
      globalLimit: [this.mainlimitMaintanceForm.value.mainoverallexposure],
      smeLimit: [this.mainlimitMaintanceForm.value.mainsmeexposure, Validators.required],
    });
  }

  //SME Limit sumbit FROM
  smeLimitFormSubmit() {
    if (this.smeLimitForm.value && this.smeLimitForm.status == "VALID") {
      if (Number(this.mainlimitMaintanceForm.value.mainoverallexposure) > Number(this.smeLimitForm.value.smeLimit)) {
        if (Number(this.mainlimitMaintanceForm.value.mainsmeexposure) != Number(this.smeLimitForm.value.smeLimit)) {
          this.smeLimitBoolean = true;
          alert("SME Limit has changed from" + ' ' + this.mainlimitMaintanceForm.value.mainsmeexposure + ' ' + "to" + ' ' + this.smeLimitForm.value.smeLimit)
          this.toastr.success("SME limit successfully updated")
          this.mainlimitMaintanceForm.patchValue({
            mainsmeexposure: this.smeLimitForm.value.smeLimit,
          });
        } else {
          this.toastr.error("Could not update ,the SME limit remain's same")
        }
      } else {
        this.toastr.error("SME Limit Amount should not exceeds or equal to the Global Limit")
      }
    } else {
      this.toastr.error("Please Fill Mandatory fields")
    }
  }
  smeLimitflipFlop(value) {
    if (value == 'edit') {
      this.smeLimitBoolean = false;
    } else {
      this.smeLimitBoolean = true;
      this.smeLimitForm.patchValue({
        smeLimit: this.mainlimitMaintanceForm.value.mainsmeexposure,
      });
    }
  }
  //sme Exposure end forms and submit

  //sector Exposure start forms and submit
  sectorLimitFormBuild() {
    this.sectorLimitForm = this.fb.group({
      sectorlimitccy: ['SGD', Validators.required],
      globalLimit: [this.mainlimitMaintanceForm.value.mainoverallexposure],
      sectorLimit: [this.mainlimitMaintanceForm.value.mainsector, Validators.required],
    });
  }
  sectorLimitFormSubmit() {
    if (this.sectorLimitForm.value && this.sectorLimitForm.status == "VALID") {
      if (Number(this.mainlimitMaintanceForm.value.mainoverallexposure) > Number(this.sectorLimitForm.value.sectorLimit)) {
        if (Number(this.mainlimitMaintanceForm.value.mainsector) != Number(this.sectorLimitForm.value.sectorLimit)) {
          this.sectorLimitBoolean = true;
          alert("Sector Limit has changed from" + ' ' + this.mainlimitMaintanceForm.value.mainsector + ' ' + "to" + ' ' + this.sectorLimitForm.value.sectorLimit)
          this.toastr.success("Sector limit successfully updated")
          this.mainlimitMaintanceForm.patchValue({
            mainsector: this.sectorLimitForm.value.sectorLimit,
          });
        } else {
          this.toastr.error("Could not update ,the Sector limit remain's same")
        }
      } else {
        this.toastr.error("Sector Limit Amount should not exceeds or equal to the Global Limit")
      }
    } else {
      this.toastr.error("Please Fill Mandatory fields")
    }
  }
  sectorLimitflipFlop(value) {
    if (value == 'edit') {
      this.sectorLimitBoolean = false;
    } else {
      this.sectorLimitBoolean = true;
      this.sectorLimitForm.patchValue({
        sectorLimit: this.mainlimitMaintanceForm.value.mainsector,
      });
    }
  }
  //sector Exposure end forms and submit

  //Buyer Exposure start forms and submit
  buyerLimitFormBuild() {
    this.buyerLimitForm = this.fb.group({
      buyerlimitccy: ['SGD', Validators.required],
      globalLimit: [this.mainlimitMaintanceForm.value.mainoverallexposure],
      buyerLimit: [this.mainlimitMaintanceForm.value.buyerLimit, Validators.required],
    });
  }
  buyerLimitFormSubmit() {
    if (this.buyerLimitForm.value && this.buyerLimitForm.status == "VALID") {
      if (Number(this.mainlimitMaintanceForm.value.mainoverallexposure) > Number(this.buyerLimitForm.value.buyerLimit)) {
        if (Number(this.mainlimitMaintanceForm.value.buyerLimit) != Number(this.buyerLimitForm.value.buyerLimit)) {
          this.buyerLimitBoolean = true;
          alert("Buyer Limit has changed from" + ' ' + this.mainlimitMaintanceForm.value.buyerLimit + ' ' + "to" + ' ' + this.buyerLimitForm.value.buyerLimit)
          this.toastr.success("Buyer limit successfully updated")
          this.mainlimitMaintanceForm.patchValue({
            buyerLimit: this.buyerLimitForm.value.buyerLimit,
          });
        } else {
          this.toastr.error("Could not update ,the Buyer limit remain's same")
        }
      } else {
        this.toastr.error("Buyer Limit Amount should not exceeds or equal to the Global Limit")
      }
    } else {
      this.toastr.error("Please Fill Mandatory fields")
    }
  }
  buyerLimitflipFlop(value) {
    if (value == 'edit') {
      this.buyerLimitBoolean = false;
    } else {
      this.buyerLimitBoolean = true;
      this.buyerLimitForm.patchValue({
        buyerLimit: this.mainlimitMaintanceForm.value.buyerLimit,
      });
    }
  }
  //Buyer Exposure end forms and submit

  //overall_transaction main table Api dependency
  gettransactionLimitUtilizationTable() {
    this.financelimitMaintananceservices.gettransLimitUtilTableDatas().subscribe(resp => {
      if (resp) {
        this.transLimitUtilTableDatas = resp;
      }
    })
  }
  overtransTableDepenData(item) {
    this.financelimitMaintananceservices.overALLtransApiDependDataService(item).subscribe(resp => {
      if (resp) {
        resp.forEach(element1 => {
          this.getSmeName.forEach(element2 => {
            if (element1.smeId.toLowerCase() == element2.userId.toLowerCase()) {
              element1.smeId = element2.smeName
            }
          });
        });
        this.dataSourceOverAllTransactionLimit = new MatTableDataSource(resp);
      }
    })
  }
  //overall_transaction main table Api dependency

  //smeTableDependData main table Api dependency start
  getsmetransLimitUtilTableDatas() {
    this.financelimitMaintananceservices.getsmetransLimitUtilTableDatas().subscribe(resp => {
      if (resp) {
        this.smetransLimitUtilTableDatas = resp;
      }
    })
  }
  checkSmeExpValue(value) {
    let transCount = 0;
    let respObj = this.smetransLimitUtilTableDatas

    respObj.map((item, index) => {
      if (item.LIMIT_PERCENT == value) {
        transCount = item.TRANS_COUNT
      }
    })
    return transCount
  }
  smeApiTableDependData(data) {
    this.financelimitMaintananceservices.smeApiDependDataService(data).subscribe(resp => {
      if (resp) {
        resp.forEach(element1 => {
          this.getSmeName.forEach(element2 => {
            if (element1.smeId.toLowerCase() == element2.userId.toLowerCase()) {
              element1.smeId = element2.smeName
            }
          });
        });
        this.dataSourceSmeExposureTable = new MatTableDataSource(resp);
      }
    })
  }

  //smeTableDependData main table Api dependency end

  //sectorApiTableDependData main table api dependency start
  getsectorTableDatas() {
    this.financelimitMaintananceservices.getsectorexposeTableDatas().subscribe(resp => {
      if (resp) {
        this.sectorTableDatas = resp;
      }
    })
  }
  checkSectorExpValue(value) {
    let transCount = 0;
    let respObj = this.sectorTableDatas
    respObj.map((item, index) => {
      if (item.LIMIT_PERCENT == value) {
        transCount = item.TRANS_COUNT
      }
    })
    return transCount
  }
  sectorApiTableDependData(value) {
    this.financelimitMaintananceservices.sectorApiDependDataService(value).subscribe(resp => {
      if (resp) {
        this.dataSourceSectorExposureTable = new MatTableDataSource(resp);
      }
    })
  }

  //sectorApiTableDependData main table api dependency end


  //start data&& graphical representation
  prevTable() {
    console.log("ttt")
    this.graphLimit = false;
    this.tableLimit = true;
  }
  prevGraph() {
    console.log("gg")
    this.tableLimit = false;
    this.graphLimit = true;

  }
  //end data&& graphical representation


  //country Exposure Tables  start
  getCountryTableDatas() {
    this.financelimitMaintananceservices.getcountryexposeTableDatas().subscribe(resp => {
      if (resp) {
        this.countryTableDatas = resp;
      }
    })
  }
  checkcountryExpValue(value) {
    let transCount = 0;
    let respObj = this.countryTableDatas
    respObj.map((item, index) => {
      if (item.LIMIT_PERCENT == value) {
        transCount = item.TRANS_COUNT
      }
    })
    return transCount
  }
  countryApiTableDependData(items) {
    this.financelimitMaintananceservices.countryApiDependDataService(items).subscribe(resp => {
      if (resp) {
        resp.forEach(element1 => {
          this.getSmeName.forEach(element2 => {
            if (element1.smeId.toLowerCase() == element2.userId.toLowerCase()) {
              element1.smeId = element2.smeName
            }
          });
        });
        this.dataSourceCountryExposureTable = new MatTableDataSource(resp);
      }
    })
  }
  // country Exposure Tables End

  //Buyer Exposure Tables  start
  getBuyerTableDatas() {
    this.financelimitMaintananceservices.getbuyerexposeTableDatas().subscribe(resp => {
      if (resp) {
        this.buyerTableDatas = resp;
      }
    })
  }
  checkBuyerExpValue(value) {
    let transCount = 0;
    let respObj = this.buyerTableDatas
    respObj.map((item, index) => {
      if (item.LIMIT_PERCENT == value) {
        transCount = item.TRANS_COUNT
      }
    })
    return transCount
  }
  buyerApiTableDependData(items) {
    this.financelimitMaintananceservices.buyerApiDependDataService(items).subscribe(resp => {
      if (resp) {
        resp.forEach(element1 => {
          this.getSmeName.forEach(element2 => {
            if (element1.smeId.toLowerCase() == element2.userId.toLowerCase()) {
              element1.smeId = element2.smeName
            }
          });
        });
        this.dataSourcebuyerExposureTable = new MatTableDataSource(resp);
      }
    })
  }
  // Buyer Exposure Tables End

  //graph Representation start
  //LIMIT Graph API 
  overallLimitMaintananceGraph() {
    this.financelimitMaintananceservices.overallGraphService().subscribe(resp => {
      this.OverallhorizontalBarChartData = [
        { data: Object.values(resp).map(i => Number(i)), label: "Exposure Datas" },
      ]
      this.OverallpieChartData = Object.values(resp).map(i => Number(i));
      this.OverallLineData = [
        { data: Object.values(resp).map(i => Number(i)), label: "Exposure Datas" },
      ]
    })
  }

  //Country Exposure Graph API 
  countryExposureGraph() {
    this.financelimitMaintananceservices.countryGraphService().subscribe(resp => {
      this.countryhorizontalBarChartData = [
        { data: Object.values(resp).map(i => Number(i)), label: "Exposure Datas" },
      ]
      this.countrypieChartData = Object.values(resp).map(i => Number(i));
      this.countryLineData = [
        { data: Object.values(resp).map(i => Number(i)), label: "Exposure Datas" },
      ]
    })
  }

  //SME Graph
  smeExposureGraph() {
    this.financelimitMaintananceservices.smeGraphService().subscribe(resp => {
      this.smehorizontalBarChartData = [
        { data: Object.values(resp).map(i => Number(i)), label: "Exposure Datas" },
      ]
      this.smepieChartData = Object.values(resp).map(i => Number(i));
      this.smeLineData = [
        { data: Object.values(resp).map(i => Number(i)), label: "Exposure Datas" },
      ]
    })
  }

  //Sector Graph API 
  sectorExposureGraph() {
    this.financelimitMaintananceservices.sectorGraphService().subscribe(resp => {
      this.sectorhorizontalBarChartData = [
        { data: Object.values(resp).map(i => Number(i)), label: "Exposure Datas" },
      ]
      this.sectorpieChartData = Object.values(resp).map(i => Number(i));
      this.sectorLineData = [
        { data: Object.values(resp).map(i => Number(i)), label: "Exposure Datas" },
      ]
    })
  }
  //BUYER Graph API 
  buyerExposureGraph() {
    this.financelimitMaintananceservices.buyerGraphService().subscribe(resp => {
      this.buyerhorizontalBarChartData = [
        { data: Object.values(resp).map(i => Number(i)), label: "Exposure Datas" },
      ]
      this.buyerpieChartData = Object.values(resp).map(i => Number(i));
      this.buyerLineData = [
        { data: Object.values(resp).map(i => Number(i)), label: "Exposure Datas" },
      ]
    })
  }
  //graph Reprecentation end
}
