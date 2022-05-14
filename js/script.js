const element = document.querySelector('.js-choice');
console.log(element);
const choices = new Choices(element, {
    searchEnabled: false,
    itemSelectText: '',
});