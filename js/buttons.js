$(document).ready(function(){
  $('.bottomTexts').hide();
  $('.matrix-container').hide();
  $('.table-container-references').hide();
  $("#appButton").click(function(){
    $('.bottomTexts').hide();
    $('.matrix-container').hide();
    $('.table-container-references').hide();
    $('#firstText').slideDown(); //# is for ids, . is for css classes. why is this not doing anything
  });
  $("#algButton").click(function(){
    $('.bottomTexts').hide();
    $('.matrix-container').hide();
    $('.table-container-references').hide();
    $('#secondText').slideDown();
    $('.matrix-container').slideDown();
    $('#tempText').slideDown();
  });
  $("#inspButton").click(function(){
    $('.bottomTexts').hide();
    $('.matrix-container').hide();
    $('.table-container-references').hide();
    $('#thirdText').slideDown();
  });
  $("#refButton").click(function(){
    $('.bottomTexts').hide();
    $('.matrix-container').hide();
    $('.table-container-references').hide();
    $('#fourthText').slideDown();
    $('.table-container-references').slideDown();
  });
});
