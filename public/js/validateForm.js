// // empty input
// // valid url http://

(function($) {
    var longUrlInput =$("#longUrl");
    const submitButton = $("#submitBtn");
    const alertBox = $("#alert");
    const form = $("#urlForm");

    function validUrl(){
        var longUrl = longUrlInput.val().trim();
        if(longUrl ===undefined || longUrl ==="" | longUrl=== null)
            throw "No link is provided";  
        // if (!/^https?:\/\//i.test(longUrl))
        //   throw "URL must start with http:// or https://";
        if(longUrl.type !== 'url' || longUrl.value !== url)
          throw "URL must be a valid URL";
        // return input.checkValidity();
    }

    submitButton.click(function(event){
        alertBox.addClass("hidden").text("");

        try {
            validUrl();
        } catch (e) {
            event.preventDefault(); 
            alertBox.removeClass("hidden").text(e);
        }
    });
})(jQuery);
