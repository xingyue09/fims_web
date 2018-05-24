<template>
    <div class="layout">
        <Layout style="height: 100%;">
            <Header style="background-color:#bac7d4;">
                <Row type="flex" justify="start" align="middle">
                    <Col :xs="6" :sm="5" :lg="3">
                        <img src="../images/logo.jpg" class="layout-logo"/>
                    </Col>
                    <Col :xs="12" :sm="14" :lg="18">
                    </Col>
                    <Col :xs="6" :sm="5"  :lg="3">
                        <Dropdown transfer trigger="click" @on-click="handleClickDropdown">
                            <a href="javascript:void(0)">
                                <span class="main-user-name">欢迎您: {{username}}</span>
                                <Icon type="arrow-down-b"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="logout">退出</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
                    </Col>
                </Row>
            </Header>
            <Layout>
                <Layout>
                    <Content class="contentStyle">
                        <router-view></router-view>
                    </Content>
                </Layout>
            </Layout>

        </Layout>
    </div>
</template>
<script>
    import Cookies from 'js-cookie';
    export default {
        components:{
        },
        data(){
            return{
                username:""
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){
                this.username = Cookies.get("username");
            },
            handleClickDropdown(name){
                if (name == 'logout') {
                    // 退出登录
                    this.$store.commit('logout',this);
                    this.$router.push({
                        name: 'login'
                    });
                }   
            },
            changeMenu(active){
                this.$router.push({name:'preview'});
            }
        }
    }
</script>
<style>
.main-user-name{
    display: inline-block;
    width: 80px;
    word-break: keep-all;
    white-space: nowrap;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
}
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    width: 100%;
    height: 100%;
}
.layout-logo{
    width: 80%;
    height: 30px;
    margin-top: 15px;
}
.contentStyle{
    transition: width .3s;
    padding:30px;
    min-height: 280px;
    background: #cdd8da;
    overflow:auto;
}
</style>
