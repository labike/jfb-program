<template>
<div class="mine_container">

    <ul class="group">
        <li class="group-item avater-warp"  @click="chooseImg">
            <div class="group-item-text">
                <div class="left">头像</div>
                <div class="right">
                    <img :src="avater" class="avater bor" v-if="avater">
                    <img :src="userInfo.headimgurl" class="avater bor" v-else>
                </div>
            </div>
        </li>
        
        <li class="group-item"  @click="openNicknameEdit">
            <div class="group-item-text">
                <div class="left">昵称</div>
                <div class="right">
                    <span>{{userInfo.nickname}}</span>
                </div>
            </div>
        </li>
    </ul>

    <lay-model :show='nicknameEdit' :btnhide='true' height='280px' @close='nicknameEdit=false'>
        <div class="edit-warp">
            <div class="nickname-title">修改昵称</div>
            <div class="nickname-edit">
                <input class="edit" type='text' :focus='nicknameFocus' :maxlength='6' v-model="nickname"/>
            </div>
            <div class="nickname-desc">好的昵称可以让你的朋友更容易记住你！</div>
            <div class="nickname-submit" @click="editNickname">确认</div>
        </div>
    </lay-model>

</div>
</template>

<script>
import { APIHOST } from '@/config/base'
import { mapState, mapActions } from 'vuex';
import { apiGetUsers, apiEditNickname } from '@/api/api';
import { callPhone } from '@/utils/index';
import LayModel from "@c/layouts/Model.vue";

export default {
    name: 'info',
    data() {
        return {
            avater: '',
            nickname: '',
            nicknameEdit: false,
            nicknameFocus: true
        }
    },
    components: {
        LayModel
    },
    computed: {
        ...mapState({
            "userInfo": state => state.user.userInfo 
        }),
    },
    onShow() {
        const self = this;
        if (!self.userInfo.nickname || !self.userInfo.mobile) {
            self.getUsers()
        }
        
    },
    methods: {
        ...mapActions('user', [
            'updataUsers',
        ]),
        getUsers() {
            const that = this;
            apiGetUsers().then(res => {
                console.log(res);
                that.updataUsers({
                    headimgurl: res.header_img,
                    nickname: res.nickname,
                    mobile: res.mobile,
                    balance: res.balance
                })
            })
        },
        chooseImg: function (e) { //这里是选取图片的方法
            const that = this;
            mpvue.chooseImage({
                count: 1, // 最多可以选择的图片张数，默认9
                sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
                sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
                success: function (res) {
                    that.uploadImg(res.tempFilePaths[0])
                },
                fail: function () {
                    // fail
                },
                complete: function () {
                    // complete
                }
            })

        },
        
        uploadImg (avater) { //这里触发图片上传的方法
            const that = this;
            mpvue.uploadFile({
                url: APIHOST + 'users-avatar',
                filePath: avater,
                name: 'FILE',
                header: {
                    "Content-Type": "multipart/form-data",
                    'accessToken': mpvue.getStorageSync('token')
                },
                success: function(res) {
                    const result = JSON.parse(res.data)
                    if (result.code === "200") {
                        that.avater = result.data.imgData 
                        mpvue.showToast({
                            title: '头像更新成功',
                            icon: 'success',
                            duration: 1000
                        })                        
                    } else {
                        mpvue.showToast({
                            title: '头像更新失败，请检查你的网络或稍后再试！',
                            icon: 'none',
                            duration: 1000
                        })
                    }
                }
            })
        },
        openNicknameEdit() {
            const self = this;
            self.nickname = self.userInfo.nickname
            self.nicknameEdit = true
        },
        editNickname() {
            const self = this;
            apiEditNickname(self.nickname).then(res => {
                mpvue.showToast({
                    title: '昵称修改成功!',
                    icon: 'success',
                    duration: 1000
                })
                self.nicknameEdit = false
                self.getUsers()
            }).catch(() => {
                self.nicknameEdit = false
                mpvue.showToast({
                    title: '昵称修改失败，请检查你的网络或稍后再试！',
                    icon: 'none',
                    duration: 1000
                })
            })
        },
    }
}
</script>


<style lang="scss" scoped>
 .avater{
    display: block;
    width: 100rpx;
    height: 100rpx;
    &.bor{
        border-radius: 100rpx;
        border: 5rpx solid #f2f2f2;
    }
}
.group{
    background: #fff;
    margin-top: 20rpx;
    .group-item{
        position: relative;
        display: flex;
        align-items: center;
        height: 100rpx;
        padding: 0 24rpx;
        .icon{
            width: 40rpx;
            height: 40rpx;
            margin: 0 24rpx;
            flex-grow: 0;
        }
        &::after{
            flex-grow: 0;
            content: '';
            width: 15rpx;
            height: 30rpx;
            margin-left: 20rpx;
            background-image: url(~@/assets/img/icon_click_right_list.png);
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
        }
        &:not(:last-child)::before {
            content: '';
            position: absolute;
            z-index: 2;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 1px;
            border-bottom: 1px solid #e8e8e8;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
            -webkit-transform-origin: 0 100%;
            transform-origin: 0 100%;
        }
    }
    .group-item-text{
        flex: 1;
        font-size: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .avater-warp{
        height: 130rpx;
    }
}

.edit-warp{
    padding: 24rpx;
    .nickname-title {
        text-align: center;
        font-size: 40rpx;
        color: #000;
        line-height: 100rpx;
    }
    .nickname-desc{
        text-align: center;
        font-size: 24rpx;
        color: #999;
        line-height: 1;
        margin-top: 40rpx;

    }
    .nickname-edit{
        background: #f2f2f2;
        position: relative;
        padding: 24rpx;
        overflow: hidden;
        .edit{
            height: 40rpx;
            color: #818181;
        }
    }
    .nickname-submit{
        margin: 58rpx auto 40rpx;
        width: 411rpx;
        height: 74rpx;
        background: linear-gradient(to right, #2EB90D , #67E24A);
        border-radius: 50rpx;
        text-align: center;
        line-height: 74rpx;
        font-size: 27rpx;
        color: #fff;
    }
}
</style>
