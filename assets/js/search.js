
const api = 'https://kanji-api.herokuapp.com'
let template

function searchByKanji (q) {
  $.ajax(api + '/kanji/' + q, {
    dataType: 'json',
    method: 'GET',
    success: function (data, status, request) {
      $('#results').empty()
      $('#results').append(getItem(data))
      $('#blankslate').removeClass('my-6 my-md-12')
      $('#title').remove()
    }
  })
}

function searchByMeaning (q) {
  q = encodeURIComponent(q)
  $.ajax(api + '/v1/search/?meaning=' + q, {
    dataType: 'json',
    method: 'GET',
    success: function (data, status, request) {
      $('#results').empty()
      for (let i = 0; i < data.search_results.length; i++) {
        const word = data.search_results[i]
        $('#results').append(getItem(word))
      }

      $('#blankslate').removeClass('my-6 my-md-12')
      $('#title').remove()
    }
  })
}

$(document).ready(function () {
  template = $('#result-item-template').prop('content')
  const loader = $('#loader-template').prop('content')

  $('#search-form').submit(function (event) {
    event.preventDefault()
    const loaderClone = $(loader).clone(true, true)
    $('#results').html(loaderClone)

    const q = $('#q').val()
    const charCode = q.charCodeAt(0)

    if (q.length === 1 && charCode > 0x4e00 && charCode < 0x9fbf) {
      searchByKanji(q)
    } else {
      searchByMeaning(q)
    }
  })
})

function getItem (data) {
  const resultItem = $(template).clone(true, true)
  $(resultItem).find('[data-temp="character"]').text(data.literal)
  $(resultItem).find('[data-temp="meanings"]').text(data.meanings.join(', '))
  $(resultItem).find('[data-temp="onyomi"]').text(data.onyomi.join(', '))
  $(resultItem).find('[data-temp="kunyomi"]').text(data.kunyomi.join(', '))
  $(resultItem).find('[data-temp]').removeClass('data-temp')

  return resultItem
}
