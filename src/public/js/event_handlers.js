$(document).ready(() => {

  $('.add-task').on('click', e => {
    e.preventDefault()
    cleanInputForm()
    $('#task-form')
    .attr("note-action", "CREATE")
    .find("#submit-button")
    .text("Create")
    $('#input-form').modal('show')
  })

  $('#input-form').on('shown.bs.modal', () => { $('#note-title').focus() })

  // event handler for submiting a new task
  $('#task-form').on('submit', e => {
    e.preventDefault()

    const type = $("#task-form").attr("note-action")
    const title = $("[name=note_title]").val().trim()
    const content = $("[name=note_content]").val().trim()
    const id = parseInt($("#task-form").attr("note-id"))

    if (!title || !content) return false

    const _payload =
      type == "CREATE" ? {title, content, type} : {id, title, content, type}
    const payload =
      stringify({ id, title, content, type })

    ws.send(payload)

    $('#input-form').modal('hide')
  })

  $('.panels-wrapper').on('click', ".closing-icon, .delete-button", function (e) {
    e.preventDefault();
    const id = $(this).parents(".note-panel").attr('note-id')
    $("#delete-form").attr("note-id", id)
    $('#delete-confirm').modal('show')
  })

  // event handler for deleting a given task
  $("#delete-form").on("submit", e => {
    e.preventDefault()

    const noteId = parseInt($("#delete-form").attr("note-id"))
    const payload = stringify({ id: noteId, type: "DELETE" })

    ws.send(payload)

    $('#delete-confirm').modal('hide')
  })

  // event handler when clicking the edit button on a given task
  $('.panels-wrapper').on('click', ".edit-button", function (e) {
    e.preventDefault();
    cleanInputForm();
    const $panel =  $(this).parents(".note-panel")
    const id = $panel.attr('note-id')
    const title = $panel.find(".note-title-text").text()
    const content = $panel.find(".note-content").text()

    $('[name=note_title]').val(title);
    $('[name=note_content]').val(content);
    $('#task-form')
    .attr("note-action", "UPDATE")
    .attr("note-id", id)
    .find("#submit-button")
    .text("Update")
    $('#input-form').modal('show');
  });

  // helper function to clean the modal form
  const cleanInputForm = () => {
    $('#input-form').modal('hide')
    $('input[name="note_title"]')
      .val('')
      .removeClass('error')
    $('textarea[name="note_content"]')
      .val('')
      .removeClass('error')
    $('label.error').remove()
  }

  // defines basic form validation rules
  $('#task-form').validate({
    rules: {
      note_title: {
        required: true,
      },
      note_content: {
        required: true,
      }
    },
    messages: {
      note_title: {
        required: "Please, enter a title for your note!"
      },
      note_content: {
        required: "Please, enter a description for your note!"
      }
    }
  })
})