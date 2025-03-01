
<template>
    <div class="card p-3 mt-3 rounded-4 shadow-sm h-100">
        <div class="d-flex flex-column justify-content-between h-100">
            <div class="top">
                <p class="text-end m-0"><i class="bi-x-lg" v-if="closable" @click="handleClose($event)" style="cursor: pointer"></i></p>

                <h5 class="text-center fw-bold" v-if="isResultTitle">{{ $t('message.result') }}</h5>
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
                                <h6 class="m-0">{{ ingredient.name }}</h6>
                                <p class="m-0" :class="abvClass">{{ ingredient.abv.toFixed(2) }} %</p>
                            </div>
                        </div>
                        <h5 class="d-flex align-items-center">{{ ingredient.volume }} {{ ingredient.unit }}</h5>
                    </div>
                    <el-divider v-if="index!==savedIngredients.length-1"></el-divider>
                </div>
            </div>
            <div class="bottom">
                <div class="d-flex justify-content-between align-items-center mt-5" >
                    <h6>{{ $t('message.total') }}</h6>
                    <p :class="getABVClass(calculatedABV)" class="text-center"><h5 class="d-inline fw-bold">{{calculatedABV}}%</h5> {{ $t('message.in') }} <h5 class="d-inline fw-bold">{{calculatedVolume}}ml</h5> {{ $t('message.liquid') }}</p>
                </div>

                <el-divider v-if="isWaterMark"></el-divider>
                <div class="d-flex align-items-center justify-content-center align-items-center" v-if="isWaterMark">
                    <img src="../../public/icon.png"  class="p-0" style="width: 50px; height: 50px;"/>
                    <div class="d-flex flex-column text-center ">
                        <h5 class="m-0 ms-2 fw-bold">AlcoCalc</h5>
                        <p>@terenzzz</p>
                    </div>

                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
// 定义 props
import {onMounted, ref} from "vue";

const props = defineProps({
    savedIngredients: {
        type: Array,
        required: true,
    },
    isWaterMark: {
        type: Boolean,
        default:true
    },
    closable: {
        type: Boolean,
        default: true
    },
    closeHandler: {
        type: Function,
        default: () => {
            console.log('close')
        },
    },
    isResultTitle: {
        type: Boolean,
        default:true
    }
});

const calculatedABV = ref(0); // 计算出的酒精浓度（ABV）
const calculatedVolume = ref(0); // 计算出的酒精浓度（ABV）


onMounted(()=>{
    getABVClass()
    ABVCalc()
})

function handleClose(event) {
    event.stopPropagation(); // 阻止事件冒泡
    props.closeHandler(); // 调用父组件传递的方法
}

// 根据 ABV 值返回对应的 CSS 类名
const getABVClass = (abv) => {
    if (abv < 10) return 'text-success'; // 低酒精浓度，绿色
    if (abv <= 20) return 'text-warning'; // 中等酒精浓度，黄色
    return 'text-danger'; // 高酒精浓度，红色
};

// 计算酒精浓度（ABV）的函数
const ABVCalc = () => {
    // 使用 reduce 计算总酒精体积和总体积
    const { totalAlcoholVolume, totalVolume } = props.savedIngredients.reduce((acc, ingredient) => {
        // 将体积统一转换为毫升（ml）
        let volumeInMl = ingredient.volume;
        if (ingredient.unit === 'oz') {
            // 1 oz = 29.5735 ml
            volumeInMl = ingredient.volume * 29.5735;
        }
        if (ingredient.unit === 'cl') {
            // 1 cl = 10 ml
            volumeInMl = ingredient.volume * 10;
        }

        // 计算酒精体积
        const alcoholVolume = (ingredient.abv * volumeInMl) / 100;
        acc.totalAlcoholVolume += alcoholVolume;
        acc.totalVolume += volumeInMl;
        return acc;
    }, { totalAlcoholVolume: 0, totalVolume: 0 });

    // 计算并更新 ABV 值
    calculatedABV.value = totalVolume === 0 ? 0 : parseInt(((totalAlcoholVolume / totalVolume) * 100));
    calculatedVolume.value = parseInt(totalVolume);
    return calculatedABV.value;
};



</script>

<style scoped lang="css">

</style>