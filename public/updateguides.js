function updateguides(id){
    console.log("hi")
    $.ajax({
        url: '/update/' + id,
        type: 'PUT',
        data: $('#update-guide').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
}
