<template>
	<Modal
        @on-ok="edit"
        v-model="show"
        :closable="false"
        ok-text="修改"
        title="日报修改"
        :loading="loading"
        :maskClosable="false"
        width="80">
        <Row slot="header" type="flex" align="middle" :gutter="16">
          <Col span="4">
            <label>日期: {{log.logdate}}  {{weekDesc}}</label>
          </Col>
        </Row>
        <mavon-editor :value="log.logcontent" style="z-index:100!important;" @change="setVal"></mavon-editor>
    </Modal>
</template>
<script>
	import instance from '../../api/index';
	import  * as util from '../../assets/util.js'
	export default{
		props:{
			logid:{
				type:String,
				required:true
			},
			modal:{
				type:Boolean,
			    default:false
			},
			loading:{
				type:Boolean,
				default:true
			}
		},
		data(){
			return{
			  log:{
			  	  id:"",
		          logdate:"",
		          logweek:"",
		          logcontent:''
			  }
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
			},
			weekDesc(){
				let logweek = this.log.logweek;
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
		    }
		},
		methods:{
		  edit(){
		  	let data = this.$data.log;
	        this.$emit("edit",data);                
		  },
		  setVal(val,html){
	        this.log.logcontent = val;
	      },
	      getLogById(){
	      	var that = this;
	      	let id = this.logid;
	      	instance.get("/log/findbyid",{params:{id:id}})
	        .then((res) => {
	          let log = res.data;
	          if(log){
	            that.log = log;
	          }
	        });
	      }
		},
		watch:{
			modal: function (val, oldVal) {
				if(val){
					this.getLogById();
				}
			}
		}
	}
</script>
<style lang="less">
</style>