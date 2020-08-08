const date = new Date();
document.querySelector('.year').innerHTML = date.getFullYear();

$('ul.nav li.dropdown').hover(function() {
    $(this).find('.dropdown-menu').stop(true, true).delay(20).fadeIn(500);
  }, function() {
    $(this).find('.dropdown-menu').stop(true, true).delay(20).fadeOut(500);
});

$(document).ready(() => {
  $(document.body).on('click', '.card[data-clickable=true]', (e) => {
    var href = $(e.currentTarget).data('href');
    window.location = href;
  });
});

/*
$(document).ready(() => {
  $("#filtered").change(function () {

      var category = $(this).val();
      var item = $(this);
      console.log(category);

      if(item.is(":checked")) {
        window.open(item.data("target"))   
        console.log("checked")
      }
      else {
        window.open(item.data("target-off"))   
      }        
      
      
    });

});
*/
