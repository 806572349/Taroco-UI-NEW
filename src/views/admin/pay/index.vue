<template>
    <div>
        <d2-container>
            11
            <d2-ueditor v-model="text"/>
        </d2-container>
    </div>
</template>

<script>
export default {
  data () {
    return {
      text: '<p>Hello World</p>'
    }
  }
}
</script>

<style scoped>

</style>
