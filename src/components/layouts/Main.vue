<template>
    <section class="jfb-flexview">
        <!-- <lay-navbar :title="title" v-if="!!title"></lay-navbar> -->
        <section class="jfb-scrollview" ref="scrollView" id="scrollView">
            <slot></slot>
        </section>
    </section>
</template>


<script>
import LayNavbar from "./Navbar.vue";
export default {
    name: "LayoutMain",
    components: {
        LayNavbar
    },
    props: {
        title: String,
    }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/components/layout.scss";
.navbar-right{
    width: 100%;
    display: flex;
    justify-content: flex-end;
}
</style>
