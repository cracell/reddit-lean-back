RedditLeanback = {};

RedditLeanback.load = function() {
  $('.ajax-loader').show();
  var baseURL,
      urlPath = RedditLeanback.pathFromURL(),
      subreddit = document.getElementById('subreddit').value,
      limit = document.getElementById('limit').value;
  if (urlPath.length > 3) {
     baseURL = $.urlParam('url');
   } else if (subreddit != '') {
     baseURL = 'r/' + subreddit + '.json?limit=' + limit + '&jsonp=RedditLeanback.processJSON';
   } else {
     baseURL = '.json?limit=' + limit + '&jsonp=RedditLeanback.processJSON'
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
  $('#images').html('');
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

RedditLeanback.processJSON = function(json){
  var links = json.data.children;
  $('.ajax-loader').hide();
  for(var i = 0; i < links.length; i++) {
    // If the url has imgur in it, try to add the image  
    if (links[i].data.url.match(/imgur/)) {
      RedditLeanback.appendImgurImage(links[i].data);
    }
  }
}

RedditLeanback.appendImgurImage = function(image) {
  var output = '',
      hideNSFW = document.getElementById('hideNSFW').value,
      url = '';
  
  var original_url = image.url;
  var split_url = original_url.split('/');
  
  output += '<div class="image"><h1>' + image.title + '</h1>';
  
  if (split_url.pop().match(/\./)) {
    url = original_url;
  } else {
    url = original_url + '.jpg';
  }
  if (hideNSFW === 'true' && image.over_18 === true) {
    output += '<a href="#" class="showNSFW">Show NSFW Image</a>';
    var hiddenStyle = 'display:none;';
  } else {
    var hiddenStyle = '';
  }
  
  output += '<a href='+ url + ' target="_window" style="' + hiddenStyle + '"><img src="' + url + '" /></a>';
  output += '<p>source: <a target="_window" href="' + original_url + '">' + original_url + '</a> - <a target="_window" href="http://www.reddit.com' + image.permalink + '">Comment at Reddit</a></p></div>';
  $('#images').append(output);
}

$(function() {
  $('.showNSFW').live('click', function(e) {
    e.preventDefault();
    $(this).next().show();
    $(this).hide();
  });
  
  $("a[href='options']").click(function(e) {
    e.preventDefault();
    $('#options').toggle();
  });
  
  $('#refresh').click(function(e) {
    e.preventDefault();
    RedditLeanback.refresh();
  })
  
  RedditLeanback.load();
});