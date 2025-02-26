<template>
    <RouterLink :to="`/recipe/${cockTail.idDrink}`"  class="text-decoration-none ">
<!--        <div class="card h-100">-->
<!--            <img :src="cockTail.strDrinkThumb">-->
<!--            <div class="card-body">-->
<!--                <h5 class="text-danger">{{cockTail.strCategory}} </h5>-->
<!--                <h3>{{cockTail.strDrink}}</h3>-->

<!--            </div>-->
<!--            <div class="card-footer" v-if="cockTail.strAlcoholic || cockTail.strIBA">-->
<!--                <button class="rounded-3 btn btn-secondary my-1 btn-sm disabled" v-if="cockTail.strAlcoholic">-->
<!--                    {{ cockTail.strAlcoholic }}-->
<!--                </button>-->
<!--                <button class="rounded-3 btn btn-secondary my-1 btn-sm disabled mx-2" v-if="cockTail.strIBA">-->
<!--                    {{ cockTail.strIBA }}-->
<!--                </button>-->
<!--            </div>-->
<!--        </div>-->
        <div class="d-flex flex-column py-2">
            <img :src="cockTail.strDrinkThumb" class="img-fluid rounded-circle">
            <div class="d-flex flex-column justify-content-center align-items-center">
                <p class="text-danger m-0 text-center">{{cockTail.strCategory}} </p>
                <h4 class="m-0 p-0 text-center">{{cockTail.strDrink}}</h4>
            </div>

        </div>


    </RouterLink>
</template>

<script setup>
// 定义 props
const props = defineProps({
    cockTail: {
        type: Object,
        required: true,
    },

});

</script>

<style scoped lang="css">
.card {
    background: rgb(236, 236, 236);
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}
</style>