function addGuide(id){
    $.ajax({
        url: '/add-guide/' + id,
        type: 'PUT',
        data: $('#add-guide').serialize(),
            success: function(result){
                window.location.replace("./");
        }
    })
}
