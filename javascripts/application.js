foo = '';
result = '';
  $(function() {
     if ($.urlParam('url').length > 3) {
        base_url = $.urlParam('url');
      } else {
        base_url = '.json?limit=30&jsonp=loadImages'
      }
      url = decodeURIComponent(base_url);
      getImages(url);
       
       $('.more').click(function(e){
         e.preventDefault();
         $('.ajax-loader').show();
         if (base_url.match(/\?/)) {
           after_op = '&'
         } else {
           after_op = '?'
         }
         url = base_url + after_op +'after=' + result.after;
        getImages(url);
       });
  });
  
  function getImages(url) {
    $('#result').html('');
    $.ajax({
      url: 'http://www.reddit.com/' + url,
      dataType: "jsonp",
      type: 'GET',
    });
  }
  
  // Used to check for Preview
  $.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results) {
      return results[1] || 0;
    } else {
      return 0;
    }
  }
  
function loadImages(res) {
  result = res.data;
  $('.ajax-loader').hide();
  $.each(res.data.children, function(index, value) { 
    if (value.data.url.match(/imgur/)) {
          var output = '';
          output += '<div class="image"><h1>' + value.data.title + '</h1>';
          var original_url = value.data.url;
          var split_url = original_url.split('/');
          var url = '';
          if (split_url.pop().match(/\./)) {
           url = original_url;
          } else {
            url = original_url + '.jpg';
          }
       output += '<a href='+ url + ' target="_window"><img src="' + url + '" /></a>';
        output += '<p>source: <a target="_window" href="' + original_url + '">' + original_url + '</a> - <a target="_window" href="http://www.reddit.com' + value.data.permalink + '">Comment at Reddit</a></p></div>';
      $('#result').append(output);
    }
  });
}