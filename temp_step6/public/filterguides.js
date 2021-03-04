function filterGuidesByClimate() {
    //get the id of the selected climate from the filter dropdown
    var climate_id = document.getElementById('climate_filter').value
    console.log(climate_id, "hi");
    //construct the URL and redirect to it
    window.location = '/guides/filter/' + climate_id;
}

