<!--
 * @Author: zhangHang
 * @Date: 2019-05-14 11:58:39
 * @Description: file content
 -->
<script>
</script>

<style>
.cell {
    background: #fff;
    text-align: right;
}
.cell li {
    position: relative;
    display: flex;
    padding-left: 0.24rem;
    overflow: hidden;
    font-size: 14px;
    line-height: 1rem;
}
.cell li:not(:last-child)::before {
    content: '';
    position: absolute;
    z-index: 2;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2rpx;
    border-bottom: 2rpx solid #e8e8e8;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
}

</style>
