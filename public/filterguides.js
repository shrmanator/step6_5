function filterGuidesByClimate() {
    let climate_id = document.getElementById('climate_filter').value;
    window.location = '/guides/filter/' + climate_id
}

