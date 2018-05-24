<template >
	<div>
		<Row type="flex" align="top" class="margin-bottom-20" :gutter="16">
      <Col span="2">
        <Select :clearable="true" placeholder="年份">
            <Option v-for="item in yearList" :value="item.id" :key="item.id">{{item.text}}</Option>
        </Select>
      </Col>
			<Col span="3">
				<DatePicker v-model="formData.startdate" format="yyyy-MM-dd" placeholder="记录日期" @on-change="formData.startdate = $event">
				</DatePicker>
			</Col>
      <!-- <Col span="4">
          <Select v-model="formData.planuserid" filterable placeholder="计划人">
              <Option v-for="item in planUserList" :value="item.id" :key="item.id">{{ item.username }}</Option>
          </Select>
      </Col> -->
      <Col span="2">
        <Button type="primary" @click="search" :loading="loading">搜索</Button>
      </Col>
      <Col span="2">
        <Button type="primary" @click="addPlan">写周报</Button>
      </Col>
		</Row>
    <div v-if="datas.length > 0">
      <Row v-for="(data,idx) in datas" :key="idx">
        <Col span="12" ref="left">
          <Card class="left-card" ref="leftContent">
            <p slot="title">第{{data.weekInfo.weeksort}}周</p>
            <a href="#" slot="extra" @click.prevent="getPlanDetail(data.weekInfo.id)">
              <Icon type="ios-compose-outline"></Icon>
            </a>
            <mavon-editor :value="data.weekInfo.plancontent" :toolbarsFlag="false"
            :subfield="false" defaultOpen="preview" class="cus-mavon-editor-left" ref="leftEditor"></mavon-editor>
          </Card>
        </Col>
        <Col span="12" ref="right">
          <CusTimeline>
                <CusTimelineItem>
                  <Icon type="ios-clock" size="30" slot="dot"></Icon>
                  <p class="time">第{{data.weekInfo.weeksort}}周</p>
                  <p class="content">{{data.weekInfo.startdate}}~{{data.weekInfo.enddate}}</p>
                </CusTimelineItem>
                <CusTimelineItem  v-for="(dayInfo,dayidx) in data.dayInfo" :key="dayidx">
                  <Card ref="rightContent">
                    <p slot="title">{{dayInfo.logdate}} {{weekDesc(dayInfo.logweek)}}</p>
                    <a href="#" slot="extra" @click.prevent="getLogDetail(dayInfo.id)">
                      <Icon type="ios-compose-outline"></Icon>
                    </a>
                    <mavon-editor :value="dayInfo.logcontent" :toolbarsFlag="false" 
                    :subfield="false" defaultOpen="preview" class="cus-mavon-editor"></mavon-editor>
                  </Card>
                </CusTimelineItem>
          </CusTimeline>
        </Col>
      </Row>
    </div>
    <Row v-else>暂无数据</Row>
    <EditPlan :modal="editModal" :loading="editLoading" 
             @edit="edit" @closeModal="closeEditModal" :planid="planid"></EditPlan>
    <AddPlan :modal="modal" :loading="submitLoading" :yearList="yearList" 
             :defaultYear="iyear" @submit="submit" @closeModal="close"></AddPlan>
    <EditLog :modal="editLogModal" :loading="editLogLoading" 
             @edit="editLog" @closeModal="closeEditLogModal" :logid="logid"></EditLog>
	</div>
</template>
<script>
import * as preview from '../../api/report/preview';
import  AddPlan from '../../components/report/AddPlan.vue'
import  EditPlan from '../../components/report/EditPlan.vue'
import  EditLog from '../../components/report/EditLog.vue'
import  CusTimeline from '../../components/timeline/CusTimeline.vue'
import  CusTimelineItem from '../../components/timeline/CusTimelineItem.vue'
import instance from '../../api/index';

	export default{
    data(){
      return{
          datas:[],
          loading: false,
          formData:{
            startdate:"",
            planuserid:""//计划人
          },
          planUserList:[],//计划人列表
          yearList:[],
          modal: false,
          iyear:"",
          submitLoading:true,
          editModal:false,
          planid:"",
          editLoading:true,
          editLogModal:false,
          logid:"",
          editLogLoading:true,
          
      }
    },
    components:{
      CusTimelineItem,
      CusTimeline,
      AddPlan,
      EditPlan,
      EditLog
    },
    created(){
         this.fetchData();
         this.getPlanUserList();
         this.getYearList();
    },
    updated(){
      this.$nextTick(function(){
          // this.setSameHeight();
      });
    },
    methods:{
      weekDesc(logweek){
        if(0 == logweek){
          return "星期天";
        }else if(1 == logweek){
          return "星期一";
        }else if(2 == logweek){
          return "星期二";
        }else if(3 == logweek){
          return "星期三";
        }else if(4 == logweek){
          return "星期四";
        }else if(5 == logweek){
          return "星期五";
        }else if(6 == logweek){
          return "星期六";
        }
      },
      edit(data){
        var that = this;
        instance({
            method:"post",
            url:"/plan/updateplan",
            data:data
        })
        .then((res) => {
          if(res.data.success){
            that.$Message.info("周报修改成功！");
            that.editModal = false;
          }else{
            that.$Message.error({
                content:res.data.errormsg,
                duration:5
            });
            that.changeEditLoading(that);
          }
        }).catch(function(err){
          that.$Message.error({
              content:err,
              duration:5
          });
          that.changeEditLoading(that);
        });
      },
      editLog(data){
        var that = this;
        instance({
            method:"post",
            url:"/log/updatelog",
            data:data
        })
        .then((res) => {
          if(res.data.success){
            that.$Message.info("日报修改成功！");
            that.editLogModal = false;
          }else{
            that.$Message.error({
                content:res.data.errormsg,
                duration:5
            });
            that.changeEditLogLoading(that);
          }
        }).catch(function(err){
          that.$Message.error({
              content:err,
              duration:5
          });
          that.changeEditLogLoading(that);
        });
      },
      closeEditModal(){
        this.editModal = false;
      },
      close(){
        this.modal = false;
      },
      closeEditLogModal(){
        this.editLogModal = false;
      },
      getYearList(){
        var year = new Date().getFullYear();
        var nextYear = parseInt(year) + 1;//明年
        this.yearList.push({id:year,text:year});
        this.yearList.push({id:nextYear,text:nextYear});
        this.iyear = year;
      },
      setSameHeight(){//设置左右两边的列等高
        var vm = this;
        for(let i = 0; i < vm.datas.length; i++){
          let data = vm.datas[i];
          var leftH = vm.$refs.left[i].$el.clientHeight;
          var rightH = vm.$refs.right[i].$el.clientHeight;
          if(leftH > rightH + 20){
            var dayInfosLen = data.dayInfo.length;
            let rightContentH = ((leftH-dayInfosLen*20-62)/dayInfosLen).toFixed(1);
            for(let j = 0; j < dayInfosLen;j++){
                vm.$refs.rightContent[j].$el.style.height = rightContentH+'px';;
            }
          }else{
            vm.$refs.leftContent[i].$el.style.height = rightH-20+'px';
            vm.$refs.leftEditor[i].$el.style.height = rightH-120+'px';
          }
        }
      },
      getPlanDetail(id){//周报详情
        this.editModal = true;
        this.planid = id;
      },  
      getLogDetail(id){//日报详情
        this.editLogModal = true;
        this.logid = id;
      },   
      changeEditLoading(vm) {
        setTimeout(function(){
          vm.editLoading = false;
          vm.$nextTick(function(){
            vm.editLoading = true;
          });
        }, 1000);
      },
      changeEditLogLoading(vm) {
        setTimeout(function(){
          vm.editLogLoading = false;
          vm.$nextTick(function(){
            vm.editLogLoading = true;
          });
        }, 1000);
      },
      changeLoading(vm) {
        setTimeout(function(){
          vm.submitLoading = false;
          vm.$nextTick(function(){
            vm.submitLoading = true;
          });
        }, 1000);
      },
      submit(data){
        var that = this;
        instance({
            method:"post",
            url:"/plan/savePlanAndLogs",
            data:data
        })
        .then((res) => {
          if(res.data.success){
            that.$Message.info("保存周报成功！");
            that.modal = false;
          }else{
            that.$Message.error({
                content:res.data.errormsg,
                duration:5
            });
            that.changeLoading(that);
          }
        }).catch(function(err){
          that.$Message.error({
              content:err,
              duration:5
          });
          that.changeLoading(that);
        });
      },
      fetchData(paramMap) {
        var that = this;
        this.loading = true;
        preview.search.r(paramMap).then((res) => {
          if(res.data.success){
            that.datas = res.data.returndata;
          }else{
            that.$Message.error({
                content:res.data.errormsg,
                duration:5
            });
          }
          that.loading = false;
        });
      },
      getPlanUserList(){
        var that = this;
        this.$ajax.get("/vplan/user/findplanuserlist",{params:{}})
        .then(function(res){
          if (res.data) {
              let planUserList = res.data;
              that.planUserList = planUserList;
          }
        }).catch(function(err) {
            that.$Message.error({
                content:err,
                duration:5
            });
        });
      },
      search(){
        var paramMap = this.formData;
        this.fetchData(paramMap);
      },
      addPlan(){
        this.modal = true;
      }      
    }
  }
</script>
<style lang="less">
  @import './preview.less';  
</style>
