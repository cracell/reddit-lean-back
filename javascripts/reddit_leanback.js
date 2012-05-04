RedditLeanback = {};

RedditLeanback.load = function() {
  var baseURL,
      urlPath = RedditLeanback.pathFromURL();
  if (urlPath.length > 3) {
     baseURL = $.urlParam('url');
   } else if (subreddit != '') {
     baseURL = 'r/' + subreddit + '.json?limit=' + limit + '&jsonp=loadImages';
   } else {
     baseURL = '.json?limit=' + limit + '&jsonp=loadImages'
   }
   var url = decodeURIComponent(baseURL);
   RedditLeanback.requestJSON(url);  
}

RedditLeanback.requestJSON = function(url){
  $.ajax({
    url: 'http://www.reddit.com/' + url,
    dataType: "jsonp",
    type: 'GET',
  }); 
}

RedditLeanback.refresh = function(){
  document.getElementById('result').innerHtml = '';
  RedditLeanback.load();
}

RedditLeanback.pathFromURL = function(){
  var results = new RegExp('[\\?&]url=([^&#]*)').exec(window.location.href);
  if (results) {
    return results[1] || 0;
  } else {
    return 0;
  }
}


var subreddit = '', limit = 30, hideNSFW = "true";
  $(function() {
    $("a[href='options']").click(function(e) {
      e.preventDefault();
      $('#options').toggle();
    });
    
    
    $('#options-form').submit(function(e) {
      e.preventDefault();
      subreddit = $('#subreddit').val();
      if (parseInt($('#limit').val()) > 0) {
        limit = $('#limit').val();
      }
      RedditLeanback.load();
    });
    
    $('#limit-form').submit(function(e) {
      e.preventDefault();
      subreddit = $('#subreddit').val();
      if (parseInt($('#limit').val()) > 0) {
        limit = $('#limit').val();
      }
      
      RedditLeanback.load();
    });
    
    $('#nsfw').change(function(){
      hideNSFW = $('#nsfw').val();
      RedditLeanback.load();
    });
        
    $('.showNSFW').live('click', function(e) {
      e.preventDefault();
      $(this).next().show();
      $(this).hide();
    });
    
    RedditLeanback.load();
       
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
  

  

  
  // Used to check for Preview

  
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
          if (hideNSFW === 'true' && value.data.over_18 === true) {
            output += '<a href="#" class="showNSFW">Show NSFW Image</a>';
            var hiddenStyle = 'display:none;';
          } else {
            var hiddenStyle = '';
          }
       output += '<a href='+ url + ' target="_window" style="' + hiddenStyle + '"><img src="' + url + '" /></a>';
        output += '<p>source: <a target="_window" href="' + original_url + '">' + original_url + '</a> - <a target="_window" href="http://www.reddit.com' + value.data.permalink + '">Comment at Reddit</a></p></div>';
      $('#result').append(output);
    }
  });
}