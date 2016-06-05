var jqueryNoConflict = jQuery;

var currentImageID = 0
var searchTerm
var page = 0;
var fullData = []

var maxPostsPerPage = 4

//begin main function
jqueryNoConflict(document).ready(function(){
    retrieveData();
});
//end main function

// grab data
function retrieveData() { //get the JSON data and if the request succeeds, then call renderDataVisualsTemplate
    dataSource = 'content.json';
    jsonData = jqueryNoConflict.getJSON(dataSource, renderDataVisualsTemplate);
};

// render compiled handlebars template
function renderDataVisualsTemplate(data){
    //handlebarsDebugHelper();
    fullData = data
    //data.blogPosts = data.blogPosts[currentImageID]//data.blogPosts.slice(0, currentImageID); //TRUNCATES ARRAY
    
    //passing path to handlebars template, where to put it in the html, data
    renderHandlebarsTemplate('dataDetailsTemplate.handlebars', '#data-details', {blogPosts:filterBlogPostsByTag(searchTerm)}); //filteredPosts was data // using curly bracket stuff to put array into an object
    
    //we're passing a fourth param here, which is a function.
    renderHandlebarsTemplate('heroBanner.handlebars', '#hero-banner', {photos:getHeroPhotos()}, setUpHeroBanner);

    renderHandlebarsTemplate('categoryList.handlebars', '#category-list', {tags:listUsedCategories()});
};

// render handlebars templates via ajax
function getTemplateAjax(path, callback) {
    var source, template;
    jqueryNoConflict.ajax({
        url: path,
        success: function (data) {
            source = data;
            template = Handlebars.compile(source);
            if (callback) callback(template);
        }
    });
};

// function to compile handlebars template //path to handlebars template, where to put it in the html, data
// IF cb is a function (aka if it's been passed), then call this function after handlebars template is rendered
function renderHandlebarsTemplate(withTemplate,inElement,withData, cb){
    getTemplateAjax(withTemplate, function(template) {
        jqueryNoConflict(inElement).html(template(withData));
        if(typeof cb ==="function"){cb()};
        //console.log(cb)
    })
};

// add handlebars debugger
function handlebarsDebugHelper(){
    Handlebars.registerHelper("debug", function(optionalValue) {
        console.log("Current Context");
        console.log("====================");
        console.log(this);
    });
};

var getQueryString = function ( field, url ) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
};

searchTerm = getQueryString('searchTerm');
page = getQueryString('page'); // returns 'sandwich'
//console.log(var1);

function filterBlogPostsByTag(searchTerm){
    var tagSearchResults = []
    var searchPath = fullData.blogPosts
    for (var k in searchPath) {
      if (searchPath.hasOwnProperty(k)) { //if entry exists
        var stringOfTags = searchPath[k].tags //put tags for entry into var
        var toSplit = stringOfTags.split(","); // define splitting character
        for (var i = 0; i < toSplit.length; i++) { //loop through
            if(searchTerm==toSplit[i]){
                tagSearchResults.push(searchPath[k]);
            }
        }
      }
    }

    if(tagSearchResults.length>(page*5)-1){
        $('#next-page-button').show();
                //showNextPrevButtons(tagSearchResults.length);
    }else{
        $('#next-page-button').hide();
    }
    if(page<2){
       $('#prev-page-button').hide(); 
    }else{
        $('#prev-page-button').show(); 
    }

    if(tagSearchResults.length>maxPostsPerPage){
        var startCut = (page*5)-5
        var endCut = startCut+maxPostsPerPage+1
        //console.log(startCut)
        tagSearchResults = tagSearchResults.slice(startCut,endCut)
    }

    return tagSearchResults
}

function showNextPrevButtons(){
    $('#next-page-button'+photoID).hide()
    $('#next-page-button'+photoID).hide()
}

function getHeroPhotos(){
    var searchTerm = "showcase"
    var tagSearchResults = []
    var searchPath = fullData.photos
    for (var k in searchPath) {
      if (searchPath.hasOwnProperty(k)) { //if entry exists
        var stringOfTags = searchPath[k].tags //put tags for entry into var
        var toSplit = stringOfTags.split(","); // define splitting character
        for (var i = 0; i < toSplit.length; i++) { //loop through
            if(searchTerm==toSplit[i]){
                tagSearchResults.push(searchPath[k]);
                //console.log(toSplit[i] + "ASD")
            }
        }
      }
    }
    //console.log(tagSearchResults)
    //setUpHeroBanner(toSplit.length)
    return tagSearchResults
}

function listUsedCategories(){
    var searchPath = fullData.blogPosts
    var allTags = []
    //var uniqueTags = []
    for (var k in searchPath) {
        if (searchPath.hasOwnProperty(k)) {
            var stringOfTags = searchPath[k].tags //put tags for entry into var
            var arrayOfSplitTags = stringOfTags.split(","); // seperate tags by ',' and chuck them in an array
            for (var i = 0; i < arrayOfSplitTags.length; i++) { //loop through
                //console.log("")
                allTags.push({tag:arrayOfSplitTags[i]});
            }
        }
    }
    var allUniqueTags = removeDuplicatesFromArray(allTags)
    allUniqueTags.sort(alphabetical);
    return allUniqueTags
}

function removeDuplicatesFromArray(array) {
    var seen = {};
    return array.filter(function(item) {
        return seen.hasOwnProperty(item.tag) ? false : (seen[item.tag] = true);
    });
}

function alphabetical(a, b)
{
     var A = a.tag.toLowerCase();
     var B = b.tag.toLowerCase();
     if (A < B){
        return -1;
     }else if (A > B){
       return  1;
     }else{
       return 0;
     }
}

function categoryLinkClick(text){
    //searchTerm = getQueryString('searchTerm'); // returns 'chicken'
    searchTerm = text.textContent
    window.open("index.html?searchTerm="+searchTerm+"&"+"page="+"1","_self")
    //console.log(searchTerm)
    //retrieveData();
    return false;
}
/*
function getFilteredPosts(searchTerm){
    for (var key in fullData.blogPosts) {
      if (fullData.blogPosts.hasOwnProperty(key)) { //if entry exists
        var stringOfTags = fullData.blogPosts[key].tags //put tags for entry into var
        var toSplit = stringOfTags.replace(", ",",").split(","); // define splitting character
        for (var i = 0; i < toSplit.length; i++) { //loop through
            //json.push({"email":toSplit[i]});
            //console.log(toSplit[i])
            //console.log(searchTerm)
            //console.log(toSplit[i])
            if(searchTerm==toSplit[i]){
                filteredPosts.push(fullData.blogPosts[key]);
            }
            //break;
            //if(searchTerm==toSplit[i]){
                //console.log(key)
                //filteredPosts.push(data.blogPosts[key]);
            //}
        }

        //alert(key + " -> " + data.blogPosts[key].tags);
      }
    }
}*/



//Get a reference to the link on the page
// with an id of "mylink"
var button1 = document.getElementById("prev-page-button");
var button2 = document.getElementById("next-page-button");

//Set code to run when the link is clicked
// by assigning a function to "onclick"
button1.onclick = button2.onclick = function() {
    document.getElementById("image-div").remove();

    if(this.id=="prev-page-button"){
        var newPage = Number(page)-1
        console.log(newPage)
        window.open("index.html?searchTerm="+searchTerm+"&"+"page="+newPage,"_self")
    }else{
        var newPage = Number(page)+1
        window.open("index.html?searchTerm="+searchTerm+"&"+"page="+newPage,"_self")
    }
    retrieveData();

    //If you don't want the link to actually 
    // redirect the browser to another page,
    // "google.com" in our example here, then
    // return false at the end of this block.
    // Note that this also prevents event bubbling,
    // which is probably what we want here, but won't 
    // always be the case.
    return false;
}

function setUpHeroBanner(numberOfItems){
    var photoID = 0;
    while ($('#hero-photo-'+photoID).length) {
        //console.log($('#hero-photo-'+i).css('display'))
        //setTimeout( console.log($('#hero-photo-'+i).css('display')) , 2000);
        //console.log(  )

        if(photoID!=0){
            $('#hero-photo-'+photoID).hide()
        }
        photoID++;
    }
}

function heroSelect(id){

    var photoID = 0;
     while ($('#hero-photo-'+photoID).length) {
        //console.log($('#hero-photo-'+i).css('display'))
        //setTimeout( console.log($('#hero-photo-'+i).css('display')) , 2000);
        //console.log(  )

        if(photoID!=id){
            $('#hero-photo-'+photoID).hide()
        }else{
            $('#hero-photo-'+photoID).show()
        }
        photoID++;
    }
}

/*
(function() {
  var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
  $.getJSON( flickerAPI, {
    tags: "mount rainier",
    tagmode: "any",
    format: "json"
  })
    .done(function( data ) {
      $.each( data.items, function( i, item ) {
        $( "<img>" ).attr( "src", item.media.m ).appendTo( "#images" );
        if ( i === 3 ) {
          return false;
        }
      });
    });
})();*/




////////TESTING


////////TESTING