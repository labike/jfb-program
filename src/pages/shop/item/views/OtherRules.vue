<template>
<div class="other-rules">
    <dl v-if="rulesData.periodOfValidity">
        <dt>有效期</dt>
        <dd>{{ rulesData.periodOfValidity }}</dd>
    </dl>

    <dl>
        <dt>不可用日期</dt>
        <dd v-if="rulesData.UnavailableDate">{{ rulesData.UnavailableDate }}</dd>
        <dd v-if="rulesData.UnavailableWeek">{{ rulesData.UnavailableWeek }}</dd>
    </dl>
    <dl>
        <dt>使用时间</dt>
        <dd>{{ rulesData.availableTime }}</dd>
    </dl>
    <dl>
        <dt>使用规则</dt>
        <dd v-if="rulesData.currency">{{ rulesData.currency }}</dd>
        <dd v-if="rulesData.bespeak">{{ rulesData.bespeak }}</dd>
        <dd v-if="rulesData.overlying">{{ rulesData.overlying }}</dd>
    </dl>
</div>
</template>

<script>
export default {
    name: 'OtherRules',
    props: {
        rulesData: Object
    },
}
</script>

<style lang="scss" scoped>
.other-rules{
    margin-top: .4rem;
    dl{
        margin-bottom: .3rem;
        dt{
            margin-bottom: .3rem;
            font-size: 13px;
            font-weight: 700;
        }
        dd{
            font-size: 13px;
            margin-bottom: .15rem;
            &::before {
                content: '';
                display: inline-block;
                width: 0;
                height: 0;
                border: 2px solid #000;
                vertical-align: middle;
                margin-top: -2px;
                margin-right: .15rem;
                border-radius: 50%;
            }
        }
    }
}
</style>