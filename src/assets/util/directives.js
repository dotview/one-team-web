export default (Vue) => {
    Vue.directive('focus-input', {
        inserted: function(el) {
            el.querySelector('input').focus()
        }
    })
    Vue.directive('focus-textarea', {
        inserted: function(el) {
            el.querySelector('textarea').focus()
        }
    })
}
