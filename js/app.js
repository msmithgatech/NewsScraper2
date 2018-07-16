$(document).ready(function(){

    //  DELETE NEWSBYTE
    $('.delNewsbyte').on("click", function(){
        var url = "/delNewsbyte/" + this.id;
        fetch(url, {
            method: 'POST'
        });
    });

    //  SAVE NEWSBYTE HTML and DB MODEL
    $('.saveNewsbyte').on("click", function(){
        var artname = $(this).parent().find("p.article_title").text();
        var blurp= $(this).parent().find("p.blurp").text();
        var date =  $(this).parent().find("p.article_date").text();
        var wwwdoc =  $(this).parent().find("a").attr("href");
        var pic = $(this).parent().find("img").attr("src");
        var savedon = Date.now();

        var saveByte = {
            artname,
            blurp,
            date,
            wwwdoc,
            pic,
            savedon,
            remarks: null
        };

        fetch("/saveNewsbyte", {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(saveByte)
        })
    });


});