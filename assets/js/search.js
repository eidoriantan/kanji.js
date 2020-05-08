
const api = 'https://kanji-api.herokuapp.com'

function searchByKanji (q, template) {
  $.ajax(api + '/kanji/' + q, {
    dataType: 'json',
    method: 'GET',
    success: function (data, status, request) {
      $('#results').empty()
      $('#results').append(fillResult(template, data))
      $('#blankslate').removeClass('my-6 my-md-12')
      $('#title').remove()
      $('#results').removeClass('d-none')
    },
    error: function (request, status, error) {
      console.log(error)
    }
  })
}

function searchByMeaning (q, template) {
  q = encodeURIComponent(q)
  $.ajax(api + '/v1/search/?meaning=' + q, {
    dataType: 'json',
    method: 'GET',
    success: function (data, status, request) {
      $('#results').empty()
      for (let i = 0; i < data.search_results.length; i++) {
        const word = data.search_results[i]
        $('#results').append(fillResult(template, word))
      }

      $('#blankslate').removeClass('my-6 my-md-12')
      $('#title').remove()
      $('#results').removeClass('d-none')
    },
    error: function (request, status, error) {
      console.log(error)
    }
  })
}

$(document).ready(function () {
  const template = $('#result-item-template').prop('content')
  $('#search-form').submit(function (event) {
    event.preventDefault()
    const q = $('#q').val()
    const charCode = q.charCodeAt(0)

    if (q.length === 1 && charCode > 0x4e00 && charCode < 0x9fbf) {
      searchByKanji(q, template)
    } else {
      searchByMeaning(q, template)
    }
  })
})

function fillResult (template, data) {
  const resultItem = $(template).clone(true, true)
  $(resultItem).find('[data-temp="character"]').text(data.literal)
  $(resultItem).find('[data-temp="meanings"]').text(data.meanings.join(', '))
  $(resultItem).find('[data-temp="onyomi"]').text(data.onyomi.join(', '))
  $(resultItem).find('[data-temp="kunyomi"]').text(data.kunyomi.join(', '))
  $(resultItem).find('[data-temp]').removeClass('data-temp')

  return resultItem
}
