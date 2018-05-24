<template>
	<Modal
        @on-ok="edit"
        v-model="show"
        :closable="false"
        ok-text="修改"
        title="周报修改"
        :loading="loading"
        :maskClosable="false"
        width="80">
        <Row slot="header" type="flex" align="middle" :gutter="16">
          <Col span="4">
            <label>年份: </label>
            <Input v-model="plan.iyear" disabled class="wd-80"></Input>
          </Col>
          <Col span="4">
            <label>周次: </label>
            <Input v-model="plan.weeksort" disabled class="wd-80"></Input>
          </Col>
          <Col span="7">
            <label>起止日期: </label>
            <span>({{plan.startdate}} ~ {{plan.enddate}})</span>
          </Col>        
        </Row>
        <mavon-editor :value="plan.plancontent" style="z-index:100!important;" @change="setVal"></mavon-editor>
    </Modal>
</template>
<script>
	import instance from '../../api/index';
	export default{
		props:{
			planid:{
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
			  plan:{
			  	  id:"",
		          iyear:"",
		          weeksort:"",
		          startdate:"",
		          enddate:"",
		          plancontent:''
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
			}
		},
		methods:{
		  edit(){
		  	let data = this.$data.plan;
	        this.$emit("edit",data);                
		  },
		  setVal(val,html){
	        this.plan.plancontent = val;
	      },
	      getPlanById(){
	      	var that = this;
	      	let id = this.planid;
	      	instance.get("/plan/findbyid",{params:{id:id}})
	        .then((res) => {
	          let plan = res.data;
	          if(plan){
	            that.plan = plan;
	          }
	        });
	      }
		},
		watch:{
			modal: function (val, oldVal) {
				if(val){
					this.getPlanById();
				}
			}
		}
	}
</script>
<style lang="less">
	@import './EditPlan.less';
</style>