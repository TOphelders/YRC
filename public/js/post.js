$(function() {
  var socket = io();

  // Initial message loading
  load_messages();

  $('#create_message').submit(function(event) {
    event.preventDefault();

    var data = JSON.stringify({
      id: '556268c4d4f1599d03247f44',
      content: $('#new_content').val()
    });

    $.ajax({
      url: '/message',
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: data
    })
      .done(function(res) {
        console.log(res.message);
        $('#create_message')[0].reset();
      });
  });

  socket.on('message posted', print_message);
});

function load_messages(range) {
  var url = '/message';
  if (typeof range !== 'undefined') url += '/start/' + range[0] + '/end/' + range[1];

  $.ajax({
    url: url,
    type: 'GET',
    dataType: 'json'
  })
    .done(function(res) {
      if(res.success) {
        res.data.forEach(print_message);
      } else {
        console.log(res.message);
      }
    });
}

function print_message(msg) {
    var template = document.querySelector('#message_template');
    template.content.querySelector('.message_poster').innerText = msg.username;
    template.content.querySelector('.message_content').innerText = msg.content;

    var clone = document.importNode(template.content, true);
    document.querySelector('#page').appendChild(clone);
}
