$(document).ready(function() {
  $("#account").popover({
      placement: 'bottom',
      html: 'true',
      title : '<span class="text-info"><strong>title</strong></span>'+
              '<button type="button" id="close" class="close" onclick="$(&quot;#example&quot;).popover(&quot;hide&quot;);">&times;</button>',
      content : 'test'
  });
});  