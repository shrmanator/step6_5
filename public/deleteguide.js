function deleteGuide(id){
    $.ajax({
        url: '/guides/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};





function deleteGuidesCert(pid, cid){
  $.ajax({
      url: '/guides_certs/pid/' + pid + '/cert/' + cid,
      type: 'DELETE',
      success: function(result){
          if(result.responseText !== undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true)
          } 
      }
  })
};
