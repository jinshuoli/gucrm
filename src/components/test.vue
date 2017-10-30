<template>
  <div>
    <h2>测试登陆</h2>
    <form id="fm1" class="fm-v clearfix" action="http://hrmstest.gucrm.com:8888/login" method="post" @submit="usernameAddition();">
      <input id="username1" name="username1" class="required" tabindex="1" accesskey="n" type="text" value="" size="25" autocomplete="off" />
      <input id="password" name="password" class="required" tabindex="2" accesskey="p" type="password" value="" size="25" autocomplete="off" />

      <input type="hidden" name="username" id="username" />
      <input type="hidden" name="lt" value="LT-166460-YhQcUbTa9kILGwJRbQfa99cdeknfdn" />
      <input type="hidden" name="execution" value="e1s1" />
      <input type="hidden" name="_eventId" value="submit" />
      <input class="btn-submit" name="submit" accesskey="l" value="登录" tabindex="4" type="submit" />
    </form>

    <el-button @click="test">test</el-button>
  </div>
</template>
<script>
// application/x-www-form-urlencoded
export default {
  data() {
    return {
    }
  },
  methods: {
    usernameAddition() {
        document.getElementById("username").value = document.getElementById("username1").value + "@renkai@" + window.location.host + "@renkai@" + window.location.search;
    },
    test(){
      this.$axios.get("http://hrmstest.gucrm.com:8888/login").then(res=>{
        console.log(res)
      })
    },
  },
  created() {},
};

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
