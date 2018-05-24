<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>
<script>
import Cookies from 'js-cookie';
export default {
    data () {
        return {
            form: {
                userName: '001',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    let that = this;
                    let params = new URLSearchParams();
                    params.append("usercode", this.form.userName);
                    params.append("pwd", this.form.password);
                    this.$ajax.post('/vplan/login', params)
                    .then(function(res) {
                        if (res.data.success) {
                            let map = res.data.returndata;
                            that.$store.commit("login",map);
                            that.$router.push("/preview");
                        } else {
                            that.$Message.error({
                                content:res.data.errormsg,
                                duration:5
                            });
                        }
                    })
                    .catch(function(err) {
                        that.$Message.error({
                            content:err,
                            duration:5
                        });
                    });
                }
            });
        }
    }
};
</script>
<style lang="less">
    @import './login.less';
</style>

