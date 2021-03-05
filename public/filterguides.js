function filterGuidesByClimate() {
    var climate_id = document.getElementById('climate_filter').value
    function deletePeopleCert(pid, cid){
        $.ajax({
            url: '/guides/filter/' + climate_id,
            type: 'GET',
            success: function(result){
                if(result.responseText !== undefined){
                    alert(result.responseText)
                }
            }
        })
    }
}

