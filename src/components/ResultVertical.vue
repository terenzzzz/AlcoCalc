
<template>
    <div class="card p-3 mt-3 rounded-4 shadow-sm">
        <h3 class="text-center fw-bold">{{ $t('message.result') }}</h3>
        <div class="row mt-3" v-for="(ingredient, index) in savedIngredients" :key="index">
            <div class="d-flex justify-content-between" >
                <div class="d-flex justify-content-center align-items-center">
                    <el-image :src="`https://www.thecocktaildb.com/images/ingredients/${ingredient.name}-small.png`" class="img-fluid" style="width: 60px; height: 60px;">
                        <template #error>
                            <div class="image-slot">
                                <img :src="`https://placehold.co/100X100/transparent/000000?text=${ingredient.name}`" class="img-fluid" style="width: 50px; height: 50px;"/>
                            </div>
                        </template>
                    </el-image>
                    <div class="text-center ms-3">
                        <h4 class="m-0">{{ ingredient.name }}</h4>
                        <p class="m-0" :class="abvClass">{{ ingredient.abv.toFixed(2) }} %</p>
                    </div>
                </div>
                <h4 class="d-flex align-items-center">{{ ingredient.volume }} {{ ingredient.unit }}</h4>
            </div>
            <el-divider v-if="index!==savedIngredients.length-1"></el-divider>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-5" >
            <h4>{{ $t('message.total') }}</h4>
            <p :class="abvClass" class="text-center"><strong class="fs-3">{{calculatedABV}}%</strong> {{ $t('message.in') }} <strong class="fs-3">{{calculatedVolume}}ml</strong> {{ $t('message.liquid') }}</p>
        </div>

        <el-divider></el-divider>
        <div class="d-flex align-items-center justify-content-center align-items-center" >
            <img src="../../public/icon.png"  class="p-0" style="width: 50px; height: 50px;"/>
            <div class="d-flex flex-column text-center ">
                <h4 class="m-0 ms-2 fw-bold">AlcoCalc</h4>
                <p>@terenzzz</p>
            </div>

        </div>
    </div>

</template>

<script setup>
// 定义 props
const props = defineProps({
    savedIngredients: {
        type: Array,
        required: true,
    },

    abvClass: {
        type: String,
        required: true,
    },

    calculatedABV: {
        type: String,
        required: true,
    },

    calculatedVolume: {
        type: String,
        required: true,
    },


});



</script>

<style scoped lang="css">

</style>