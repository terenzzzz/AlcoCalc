
<template>
    <div class="position-relative">
        <img src="@/assets/bar_hero.png" class="img-fluid object-fit-cover w-100" style="height:30vh; filter: blur(5px)">
        <div class="position-absolute text-center text-white" style="top: 50%; left: 50%; transform: translate(-50%, -50%);">
            <h1>{{ $t('message.title') }}</h1>
            <p>{{ $t('message.findMore') }} <a href="https://terenzzzz.cn/whatToMix/" target="_blank">WhatToMix</a></p>
            <a href="javascript:void(0);" class="item" @click="toggleLanguage">
                <img :src="currentFlag"  style="width: 32px"/>
            </a>
        </div>

        <div class="position-absolute text-center text-white" style="bottom: 0; right: 0;">
            <p class="me-4">{{ $t('message.author') }}： <a href="https://terenzzzz.cn" target="_blank">Terenz</a></p>
        </div>

    </div>
    <div class=" container" id="container">

        <el-divider></el-divider>

        <div id="result" class="text-center my-5" :class="getABVClass(CalculatedABV)">
            <p><strong class="fs-1">{{CalculatedABV}}%</strong> {{ $t('message.in') }} <strong class="fs-1">{{CalculatedVolume}}ml</strong> {{ $t('message.liquid') }}</p>
        </div>

        <!--            Select Box-->
        <div class="row mt-3 ">
                <strong>{{ $t('message.ingredientsUsed') }}</strong>
                <el-select
                    v-model="selectedIngredients"
                    multiple
                    filterable
                    :placeholder="$t('message.ingredientsUsedPlaceHolder')"
                    size="large"
                    clearable
                    allow-create
                    @change="onTagChange"
                    @remove-tag="removeTag"
                    @clear="clearTag"
                >
                    <el-option
                        v-for="item in ingredients"
                        :key="item.strIngredient1"
                        :label="item.strIngredient1"
                        :value="item.strIngredient1"
                    />
                </el-select>
            </div>

        <div class="row mt-5">
            <div class="col-4 col-xl-3 my-2" v-for="(ingredient, index) in savedIngredients" :key="index">
                <div @click="onIngredientEdit(index)" class="d-flex" style="cursor: pointer;">
                    <div class="d-flex justify-content-center">
                        <el-image :src="`https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(ingredient.name)}-small.png`" class="img-fluid" lazy>
                            <template #error>
                                <div class="image-slot">
                                    <img :src="`https://placehold.co/100X100/transparent/000000?text=${ingredient.name}`" class="img-fluid" style="width: 100px; height: 100px;"/>
                                </div>
                            </template>
                        </el-image>
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                        <p class="m-0">{{ ingredient.name }}</p>
                        <p class="m-0" :class="getABVClass(ingredient.abv)">{{ ingredient.abv.toFixed(2) }} %</p>
                        <p class="m-0">{{ ingredient.volume }} {{ ingredient.unit }}</p>
                    </div>
                </div>
            </div>
        </div>


        <el-divider></el-divider>
        <div class="row mt-5">
            <h3>{{ $t('message.reference') }}</h3>
            <div class="col-4 col-xl-3" v-for="(r, index) in abvReference" :key="index">
                <div class="d-flex my-2  border py-2 px-3 shadow-sm">
                    <div class="d-flex justify-content-center">
                        <el-image :src="`https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(r.name)}-small.png`" class="img-fluid" lazy>
                            <template #error>
                                <div class="image-slot">
                                    <img :src="`https://placehold.co/100X100/transparent/000000?text=${r.name}`" class="img-fluid" style="width: 100px; height: 100px;"/>
                                </div>
                            </template>
                        </el-image>
                    </div>
                    <div class="d-flex flex-column justify-content-center text-center w-100">
                        <p class="m-0">{{ r.name }}</p>
                        <p class="m-0" :class="getABVClass(r.abv)">{{ r.abv }} %</p>
                    </div>
                </div>

            </div>
        </div>

    </div>
    <el-dialog
        v-model="centerDialogVisible"
        :title="$t('message.configuration')"
        width="800"
        align-center
        :show-close="false"
    >
        <el-divider></el-divider>
        <p>{{ $t('message.choosingIngredient') }}：<strong>{{ selectingIngredient.name }}</strong></p>
        <div class="row" >
            <div class="col-4">
                <label for="abv" class="form-label">{{ $t('message.abv') }}</label>
                <input type="number" min="0" class="form-control" id="abv" v-model="selectingIngredient.abv" />
            </div>
            <div class="col-4">
                <label for="volume" class="form-label">{{ $t('message.volume') }}</label>
                <input type="number" min="0" class="form-control" id="volume" v-model="selectingIngredient.volume" />
            </div>
            <div class="col-4">
                <label for="unit" class="form-label">{{ $t('message.unit') }}</label>
                <el-select
                    v-model="selectingUnit"
                >
                    <el-option
                        v-for="item in unitList"
                        :key="item"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>


            </div>
        </div>
        <el-divider></el-divider>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="cancelConfiguration">{{ $t('message.cancel') }}</el-button>
                <el-button @click="removeConfiguration" v-if="!isAdding" type="danger">{{ $t('message.remove') }}</el-button>
                <el-button type="primary" @click="saveConfiguration">
                    {{ $t('message.confirm') }}
                </el-button>
            </div>
        </template>
    </el-dialog>

</template>

<script setup>
    // 导入 Vue 3 的 Composition API 和相关工具函数
    import {onMounted, reactive, ref, computed, watch, h} from "vue";
    // 导入 API 函数，用于获取鸡尾酒原料列表
    import { listIngredients } from "@/api/cocktails.js";
    import {ElNotification} from "element-plus";
    import {abvReference} from  "./enum/AbvReference.js"

    import enFlag from '@/assets/country/en.png';
    import zhFlag from '@/assets/country/cn.png';
    import { useI18n } from 'vue-i18n';
    const { t, locale } = useI18n();



    // 定义单位列表，包含毫升（ml）和盎司（oz）
    const unitList = [
        { value: 'ml', label: 'ml' },
        { value: 'cl', label: 'cl' },
        { value: 'oz', label: 'oz' }
    ];

    const currentLanguage = ref(locale.value);

    const flags= {
        en: enFlag,
        zh: zhFlag,
    }

    // 计算属性：动态返回当前语言的国旗
    const currentFlag = computed(() => flags[currentLanguage.value]);

    // 切换语言的方法
    function toggleLanguage() {
        if (currentLanguage.value === 'zh') {
            currentLanguage.value = 'en';
            locale.value = 'en';
        } else {
            currentLanguage.value = 'zh';
            locale.value = 'zh';
        }
    }



    // 定义响应式变量
    const centerDialogVisible = ref(false); // 控制编辑对话框的显示与隐藏
    const ingredients = ref([]); // 存储从 API 获取的原料列表
    let selectingIngredient = reactive({}); // 当前正在编辑的原料对象
    const selectingUnit = ref('ml'); // 当前选择的单位，默认为毫升（ml）

    const savedIngredients = ref([]); // 存储已保存的原料配置
    const selectedIngredients = ref([]); // 存储已选中的原料名称
    const CalculatedABV = ref(0); // 计算出的酒精浓度（ABV）
    const CalculatedVolume = ref(0); // 计算出的酒精浓度（ABV）

    let isAdding = ref(false);

    // 组件挂载时执行的逻辑
    onMounted(async () => {
        // 调用 API 获取原料列表，并更新 ingredients 的值
        const ingredientsResponse = await listIngredients();
        ingredients.value = ingredientsResponse.data.drinks;
    });

    // 编辑原料时的回调函数
    const onIngredientEdit = (index) => {
        isAdding.value = false;
        // 将选中的原料数据复制到 selectingIngredient 中
        Object.assign(selectingIngredient, savedIngredients.value[index]);
        // 更新当前选择的单位
        selectingUnit.value = savedIngredients.value[index].unit;
        // 打开编辑对话框
        centerDialogVisible.value = true;
    };

    // 创建一个新的原料对象
    const createIngredient = (name = '', abv = 0, volume = 0, unit = 'ml') => ({ name, abv, volume, unit });

    // 保存配置的回调函数
    const saveConfiguration = () => {
        // 表单验证
        if(Number(selectingIngredient.abv) < 0 || Number(selectingIngredient.volume) < 0){
            validationNotification()
        }else{
            // 查找当前编辑的原料是否已存在于 savedIngredients 中
            const index = savedIngredients.value.findIndex(item => item.name === selectingIngredient.name);
            if (index !== -1) {
                // 如果存在，更新其单位
                savedIngredients.value[index] = {
                    ...selectingIngredient,
                    unit: selectingUnit.value
                };
            } else {
                // 如果不存在，将其添加到 savedIngredients 中
                savedIngredients.value.push({ ...selectingIngredient, unit: selectingUnit.value });
            }
            // 关闭对话框
            centerDialogVisible.value = false;
            // 重置 selectingIngredient 和 selectingUnit
            resetSelecting();
        }

    };

    // 移除选中的原料
    const removeConfiguration = () => {
        centerDialogVisible.value = false; // 关闭对话框

        selectedIngredients.value = selectedIngredients.value.filter(
            ingredient => ingredient !== selectingIngredient.name
        );

        // 过滤掉未选中的原料
        const selectedNames = new Set(selectedIngredients.value);
        savedIngredients.value = savedIngredients.value.filter(saved => selectedNames.has(saved.name));
    };

    // 取消配置的回调函数
    const cancelConfiguration = () => {
        // 如果是添加操作，移除最后一个选中的原料
        if (isAdding) {
            selectedIngredients.value.pop();
        }

        // 关闭对话框
        centerDialogVisible.value = false;

        // 重置 selectingIngredient 和 selectingUnit
        resetSelecting();
    };



    // 根据 ABV 值返回对应的 CSS 类名
    const getABVClass = (abv) => {
        if (abv < 10) return 'text-success'; // 低酒精浓度，绿色
        if (abv <= 20) return 'text-warning'; // 中等酒精浓度，黄色
        return 'text-danger'; // 高酒精浓度，红色
    };

    // 计算酒精浓度（ABV）的函数
    const ABVCalc = () => {
        // 使用 reduce 计算总酒精体积和总体积
        const { totalAlcoholVolume, totalVolume } = savedIngredients.value.reduce((acc, ingredient) => {
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
        CalculatedABV.value = totalVolume === 0 ? 0 : parseInt(((totalAlcoholVolume / totalVolume) * 100));
        CalculatedVolume.value = totalVolume;
        return CalculatedABV.value;
    };

    // 当选中原料发生变化时的回调函数
    const onTagChange = () => {
        isAdding.value = true;
        // 将最后一个选中的原料名称赋值给 selectingIngredient
        selectingIngredient = createIngredient(selectedIngredients.value[selectedIngredients.value.length - 1]);
        // 更新当前选择的单位
        selectingUnit.value = selectingIngredient.unit;
        // 打开编辑对话框
        centerDialogVisible.value = true;
    };

    // 移除选中的原料标签
    const removeTag = () => {
        centerDialogVisible.value = false; // 关闭对话框
        // 过滤掉未选中的原料
        const selectedNames = new Set(selectedIngredients.value);
        savedIngredients.value = savedIngredients.value.filter(saved => selectedNames.has(saved.name));
    };

    // 清空所有选中的原料标签
    const clearTag = () => {
        centerDialogVisible.value = false; // 关闭对话框
        savedIngredients.value = []; // 清空已保存的原料
    };

    // 重置 selectingIngredient 和 selectingUnit
    const resetSelecting = () => {
        selectingIngredient.value = [];
        selectingUnit.value = "ml";
        isAdding.value = false;
    };

    // 监听 savedIngredients 的变化，自动计算 ABV
    watch(savedIngredients, () => {
        ABVCalc();
    }, { deep: true }); // 深度监听，确保对象内部属性的变化也能触发

    const validationNotification = () => {
        ElNotification({
            title: `${t('message.dataError')}`,
            message: `${t('message.notLessThan0')}`,
            type: 'error',
        })
    }

</script>


<style scoped lang="css">
* {
    box-sizing: border-box;
}

#container {
    display: flex;
    flex-direction: column;
    min-height: 100vh; /* 整个视口高度，包含头部*/
}

a {
    text-decoration: underline;
    color: white;
    font-weight: bold;
}


</style>