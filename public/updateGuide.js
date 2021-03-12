function addGuide(id){
    $.ajax({
        url: '/update-guide/' + id,
        type: 'PUT',
        data: $('#update-guide').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
}
