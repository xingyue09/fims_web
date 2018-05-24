<template>
	<Modal
        @on-ok="submit"
        v-model="show"
        :closable="false"
        ok-text="保存"
        title="周报编写"
        :loading="submitLoading"
        :maskClosable="false"
        width="80">
        <Row slot="header" type="flex" align="middle" :gutter="16">
          <Col span="4">
            <label>年份:</label>
            <Select style="width:80%;" v-model="iyear" :clearable="true" placeholder="年份" @on-change="getPlanList">
                <Option v-for="(item,idx) in yearList" :value="item.id" :key="idx">{{item.text}}</Option>
            </Select>
          </Col>
          <Col span="4">
            <label>周次:</label>
            <Select style="width:80%;" v-model="weeksort" filterable :clearable="true" placeholder="周次" @on-change="getWeekStartAndEnd">
                <Option v-for="(item,idx) in weekList" :value="item.id" :key="iyear+item.id">{{ item.text }}</Option>
            </Select>
          </Col>
          <Col span="7">
            <label>起止日期: </label>
            <span>({{startdate}} ~ {{enddate}})</span>
          </Col>        
        </Row>
        <mavon-editor :value="plancontent" style="z-index:100!important;" @change="setVal"></mavon-editor>
    </Modal>
</template>
<script>
	import instance from '../../api/index';
	import  * as util from '../../assets/util.js'
	export default{
		props:{
			modal:{
				type:Boolean,
			    default:false
			},
			yearList:{
				type:Array,
				required:true
			},
			defaultYear:{
				type:Number,
				required:true
			},
			submitLoading:{
				type:Boolean,
				default:true
			}
		},
		data(){
			return{
	          weekList:[],
	          finishedWeekList:[],//计划完成的周次列表
	          iyear:this.defaultYear,
	          weeksort:"",
	          startdate:"",
	          enddate:"",
	          plancontent:''
			}		  
		},
		computed:{
			show:{
				get(){
					return this.modal
				},
				set(newValue){
					if(!newValue){
						this.$emit("closeModal");
					}
				}
			}
		},
		methods:{
		  submit(){
		  	let data = {
	          iyear:this.iyear,
	          weeksort:this.weeksort,
	          startdate:this.startdate,
	          enddate:this.enddate,
	          plancontent:this.plancontent
	        };
	        this.$emit("submit",data);                
		  },
		  setVal(val,html){
	        this.plancontent = val;
	      },
		  getPlanList(){
	        var that = this;
	        instance.get("/plan/findlist",{iyear:this.iyear})
	        .then((res) => {
	          if(res.data){
	            for(let i = 0; i < res.data.length; i++){
	              var plan = res.data[i];
	              var weeksort = plan.weeksort;
	              that.finishedWeekList.push(weeksort);              
	            };
	            that.getWeekList(that);
	          }
	        });
	      },
	      getWeekList(vm){
	        vm.weekList = [];
	        if(vm.finishedWeekList.length > 0){
	          var year = vm.iyear;
	          if(year){//year清空后
	          	  var curWeek = 1, lastWeek = 1;
		          let count = 0;
		          if(year == new Date().getFullYear()){
		            curWeek = util.getWeekOfYear(new Date());//当前日期所属周次
		            lastWeek = util.getWeekOfYear(new Date(year,11,31));//本年度最后周次
		          }
		          for(let i = curWeek; i <= lastWeek; i++){
		            if(year != new Date().getFullYear()){
		              vm.weekList.push({id:i,text:i});
		              if(count == 0){
		                vm.weeksort = i;
		              }
		              count++;
		            }else{
		              if(vm.finishedWeekList.indexOf(i) == -1){
		                vm.weekList.push({id:i,text:i});
		                if(count == 0){
		                  vm.weeksort = i;
		                }
		                count++;
		              }
		            }            
		          }
		          vm.getWeekStartAndEnd(vm);
	          }else{
	          	vm.weeksort = "";
	          }          
	        }    
	      },
	      getWeekStartAndEnd(vm){
	        if(typeof vm == 'number' || vm == ""){
	          vm = this;
	        }
	        let iyear = vm.iyear, weeksort = vm.weeksort;
	        if(iyear && weeksort){
	        	var dateRange = util.getWeekStartAndEnd(iyear,weeksort);//周次的起止日期
		        vm.startdate = dateRange[0];
		        vm.enddate = dateRange[1];
	        }else{
	        	vm.startdate = "";
		        vm.enddate = "";
	        }	        
	      }
		},
		watch:{
			modal: function (val, oldVal) {
				if(val){
				   this.getPlanList();
				   this.plancontent = "";
				}
			}
		}
	}
</script>