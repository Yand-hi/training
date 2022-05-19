<template>
    <div id="dd_login_container" />
</template>
<script>
export default {
    data(){
        return{
            scriptEle:null,
        }
    },
    computed:{
        info(){
            return this.$store.state.info
        },
        redirect(){
            // return encodeURIComponent('http://192.168.1.91:7011/')
            return encodeURIComponent(this.info.dingding_login_back_url)
        },
        appid(){
            return this.info.dingding_login_app_id
        },
        http_url(){
            return encodeURIComponent(`https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${this.appid}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${this.redirect}`);
        },
    },
    created(){
        this.loadJs('https://g.alicdn.com/dingding/dinglogin/0.0.5/ddLogin.js', () => {
        document.getElementsByTagName('head')[0].removeChild(this.scriptEle);
});
    },
    methods:{
        getSetting(){

        },
        loadJs(url, callback){
            let done = false;
            const script = document.createElement('script');
            this.scriptEle = script;
            script.type = 'text/javascript';
            script.language = 'javascript';
            script.src = url;
            script.onload = script.onreadystatechange = function() {
                if (!done && (!script.readyState || script.readyState === 'loaded' || script.readyState === 'complete')) {
                done = true;
                script.onload = script.onreadystatechange = null;
                callback && callback();
                }
            };
            document.getElementsByTagName('head')[0].appendChild(script);
        },
        ddlogin() {
            DDLogin({
                id: 'dd_login_container',
                // goto这里需要对url整体做一个urlencode编码
                goto: this.http_url,
                style: 'border:none;background-color:#FFFFFF;',
                width: '300',
                height: '300',
            });
            const handleMessage = (event) => {
                const origin = event.origin;
                // 判断是否来自ddLogin扫码事件
                if (origin === 'https://login.dingtalk.com') {
                const loginTmpCode = event.data;
                // 这里url不用进行urlencode编码
                const url = 'https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=' + this.appid + '&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=' + this.redirect + '&loginTmpCode=' + loginTmpCode;
                window.location.href = url;
                }
            };
            if (typeof window.addEventListener !== 'undefined') {
                window.addEventListener('message', handleMessage, false);
            } else if (typeof window.attachEvent !== 'undefined') {
                window.attachEvent('onmessage', handleMessage);
            }
        }
    }

}
</script>

<style>

</style>