function filterGuidesByClimate() {
    var climate_id = document.getElementById('climate_filter').value;
    // simplified jquery
    $.get('/guides/filter/'+ climate_id, function(data){
        console.log(data)
        document.open();
        document.write(data);
        document.close();
    });
}

