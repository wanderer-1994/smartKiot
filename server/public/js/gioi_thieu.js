$('.intro .q').on('click', (event) => {
    changeElementTextColorAnimation($(event.target));
    if($(event.target).attr("data-processing")) return;
    $(event.target).attr("data-processing", true);
    $(event.target).next('.a').slideToggle(400, () => {
        $(event.target).removeAttr("data-processing");
    });
})