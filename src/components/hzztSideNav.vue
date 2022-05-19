<template>
  <aside class="el-aside" id="asideNav" :class="{'close-side': collapse}">

    <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical"
      :unique-opened="true"
      background-color="#0E1935"
      text-color="#dadada"
      active-text-color="#ffffff"
      :collapse="collapse"
      :router="true">
      <div class="side-menu">

        <template
          :index="index+''" v-for="(menu, index) in menuList"
        >
          <el-submenu
            v-if="menu.children&&menu.children.length >0"
            :index="menu.path" :key="index">
            <template slot="title">
              <i><img :src="menu.icon" alt="" width="16"></i>
              <span style="margin-left: 20px" slot="title">{{menu.name}}</span>
            </template>
            <template v-for="(child, index1) in menu.children"  v-if="!child.notShow">
              <a target="_blank" v-if="child.isTarget" :key="index1" class="target-a" :href="child.path">
                <el-menu-item >
                  <span style="margin-left: 20px" slot="title">
               {{child.name}}
              </span>
                </el-menu-item>
              </a>
              <el-menu-item v-else :index="menu.path+'/'+child.path" :key="index1">
                <span style="margin-left: 20px">{{child.name}}</span>
              </el-menu-item>
            </template>
          </el-submenu>
          <el-menu-item
            v-if="menu.children&&menu.children.length ===0&&!menu.isShow"
            :index="menu.path"
            :key="index" class="single-nav">
            <!-- <i class="el-icon-menu"></i>-->
            <i><img :src="menu.icon" alt="" width="16"></i>
            <span style="margin-left: 20px" slot="title">{{menu.name}}</span>
          </el-menu-item>
        </template>



      </div>
    </el-menu>
  </aside>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        activeMenu: '',
      }
    },
    watch: {
      '$route'(val,old){
        let { meta, path } = ['/reading'].includes(val.path) ? old : val;
        this.activeMenu = meta.activeMenu ||  path;
      }
    },
    computed:{
      ... mapState([
        'user',
        'menus',
        'collapse',
      ]),
    // activeMenu() {
    //   const route = this.$route;
    //   const { meta, path } = route;
    //   // 在路由配置文件中设置自定义的路由路径到meta.activeMenu属性中，来控制菜单自定义高亮显示
    //   if (meta.activeMenu) {
    //     return meta.activeMenu;
    //   }
    //   console.log(meta.activeMenu ,path);
    //  return path;
    // },
      menuList() {
        // if (this.user?.role) {
        //  const roles = this.user.role;
        //  if (roles.find((role) => role.id === 1)) return this.menus;
        //  else return this.menus.slice(0, 3);
        // } else {
          // return [];
          return this.menus;
        // }
      }
    },
    methods: {

    },
  }
</script>

<style lang="scss">
  @import "../style/variables";

  .el-aside {
    display: flex;
    flex-direction: column;
    background: #0E1935;
    &.close-side{
      .side-top{
        width: 50px;
        transition: width linear .3s;
      }
    }
    .side-top{
      height: 40px;
      width: 210px;
      background: $_pm-base-color;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #FFFFFF;
      line-height: 1;
      margin-bottom: 30px;
      transition: width linear .3s;

    }
    .side-menu{
      font-size: 16px;
    }
    .el-menu {
      border-right: none;
      .single-nav {
        .el-tooltip {
          display: flex !important;;
          align-items: center;
          justify-content: center;
          &:hover {
            background-color: $_pm-base-color !important;
          }
        }
        [class^="el-icon-"] {
          margin-right: 0;
        }
      }
    }
    .el-submenu__title {
      height: 43px;
      line-height: 43px;
      font-size: 16px;
      display: flex;
      align-items: center;
    }
    .el-menu-vertical:not(.el-menu--collapse) {
      width: 210px;
      /*min-height: 800px;*/
      flex: 1;
    }
    .el-menu--collapse {
      width: 50px;
      height: 100%;
      .el-submenu {
        & > .el-submenu__title {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 !important;
          span {
            display: none;
          }
          &:hover {
            & > .el-submenu__title {
              background-color: $_pm-base-color !important;
            }
            i {
              color: #fff !important;
            }
            background-color: $_pm-base-color !important;
          }
        }
        &.is-active {
          & > .el-submenu__title {
            background-color: $_pm-base-color !important;
          }
          i {
            color: #fff !important;
          }
        }
      }
    }
    .el-submenu {
      .el-menu-item {
        height: 43px;
        line-height: 43px;
        min-width: 210px;
        font-size: 14px;
        padding: 0 30px !important;
        &.is-active {
          background-color: $_pm-base-color !important;
        }
        &:hover {
          background-color: $_pm-base-color !important;
        }
      }
    }
  }

  .el-menu-item {
    height: 43px;
    line-height: 43px;
    font-size: 16px;
    display: flex;
    align-items: center;
    &:hover {
      background-color: $_pm-base-color !important;
    }
    &.is-active {
      background-color: $_pm-base-color !important;
      i {
        color: #fff !important;
      }
    }
  }
  .target-a{
    text-decoration: none;
    color: #E7EBEE;
    &:link{
      text-decoration: none;
    }
    &:visited{
      text-decoration: none;
    }
    &:hover{
      text-decoration: none;
    }
  }
</style>
