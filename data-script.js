var jqueryNoConflict = jQuery;

var currentImageID = 0

//begin main function
jqueryNoConflict(document).ready(function(){
    retrieveData();
});
//end main function

// grab data
function retrieveData() {
    var dataSource = 'content.json';
    jqueryNoConflict.getJSON(dataSource, renderDataVisualsTemplate);
};

// render compiled handlebars template
function renderDataVisualsTemplate(data){
    handlebarsDebugHelper();

    data.blogPosts = data.blogPosts[currentImageID]//data.blogPosts.slice(0, currentImageID); //TRUNCATES ARRAY
    console.log(data.blogPosts)

    renderHandlebarsTemplate('dataDetailsTemplate.handlebars', '#data-details', data);
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

// function to compile handlebars template
function renderHandlebarsTemplate(withTemplate,inElement,withData){
    getTemplateAjax(withTemplate, function(template) {
        jqueryNoConflict(inElement).html(template(withData));
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

var var1 = getQueryString('page'); // returns 'chicken'
//var var2 = getQueryString('that'); // returns 'sandwich'
console.log(var1);



//Get a reference to the link on the page
// with an id of "mylink"
var button1 = document.getElementById("pictureButton1");
var button2 = document.getElementById("pictureButton2");

//Set code to run when the link is clicked
// by assigning a function to "onclick"
button1.onclick = button2.onclick = function() {
    document.getElementById("image-div").remove();

    if(this.id=="pictureButton1"){
        currentImageID-=1;
    }else{
        currentImageID+=1;
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
