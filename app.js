function render() {
  $('.todo_list').empty();
  function todolistItem(i, res) {
    const checked = res[0].todos[i]['done'] === 1 ? 'checked' : '';
    return `
    <div class="todo_item form-check">
      <input class="todo_done form-check-input" type="checkbox" name="done" data-id=${res[0].todos[i]['id']} ${checked}>
      <label class="todo_content form-check-label">
        ${res[0].todos[i]['content']}
      </label>
      <button type="button" class="todo_edit btn btn-outline-secondary" data-id=${res[0].todos[i]['id']}>編輯</button>
      <button type="button" class="todo_delete btn btn-outline-secondary" data-id=${res[0].todos[i]['id']}>刪除</button>
      <hr>
    </div>
  `;
  }
  $.ajax({
    type: 'GET',
    url: './index.php',
    dataType: 'json',
    success: (res) => {
      let len = res[0].todos.length; // 得到共有幾筆資料
      if (res[0].result === "success") {
        for (let i = 0; i <= len - 1; i += 1) {
          $('.todo_list').append(todolistItem(i, res));
        }
      }
      $('.editing_background').css('display', 'none'); // render 結束關閉黑背景
    }
  });
}

$(document).ready(() => {
  render();
  // 送出新 todo
  $('#input').keypress((e) => {
    const code = (e.keyCode ? e.keyCode : e.which);
    if (code === 13) {
      const input = $('#input').val(); // 從輸入框取得資料
      $('#input').val(''); // 清空輸入框
      let todolist = { "_method": "POST" };
      todolist.content = input; // 添加資料
      $('.editing_background').css('display', 'block'); // 黑背景表示執行中
      $.ajax({
        type: "POST",
        url: "./index.php",
        data: todolist,
        dataType: "json",
        success: function (res) {
          if (res.result === 'success') {
            render();
          }
        }
      });
    }
  });

  // enter 送出編輯
  $('#edit').keypress((e) => {
    const code = (e.keyCode ? e.keyCode : e.which);
    if (code === 13) {
      let todolist = { "_method": "PATCH" };
      todolist.id = $('.editing_id').val(); // 添加 id
      todolist.content = $('#edit').val() // 添加資料
      $('.editing_area').css('display', 'none'); // 關閉輸入視窗
      $.ajax({
        type: "POST",
        url: "./index.php",
        data: todolist,
        dataType: "json",
        success: (res) => {
          if (res.result === 'success') {
            render();
          }
        }
      });
    }
  });

  $('.container').on('click', (e) => { // 事件代理
    // 是否完成
    if (e.target.classList.contains('todo_done')) {
      const id = e.target.getAttribute('data-id');
      const done = e.target.checked;
      let todolist = { "_method": "PATCH" };
      todolist.id = id; // 添加資料
      todolist.done = done;
      $.ajax({
        type: "POST",
        url: "index.php",
        data: todolist,
        dataType: "json",
        success: (res) => {
          if (res.result !== 'success') {
            render(); // 不成功就重新 render
          }
        }
      });
    }

    // 刪除
    if (e.target.classList.contains('todo_delete')) {
      const id = e.target.getAttribute('data-id');
      let todolist = { "_method": "DELETE" };
      todolist.id = id; // 添加資料
      $('.editing_background').css('display', 'block'); // 黑背景表示執行中
      $.ajax({
        type: "POST",
        url: "./index.php",
        data: todolist,
        dataType: "json",
        success: (res) => {
          if (res.result === 'success') {
            render();
          }
        }
      });
    }

    // 顯示編輯 事件代理
    if (e.target.classList.contains('todo_edit')) {
      // 先發 ajax 取得單一筆資料，然後 callback 之後顯示編輯框框，發送另外寫
      const id = e.target.getAttribute('data-id');
      $('.editing_background').css('display', 'block'); // 先關閉畫面
      $.ajax({
        type: "GET",
        url: `./index.php?id=${id}`,
        dataType: "json",
        success: (res) => {
          $('.editing_area').css('display', 'block'); // 顯示編輯
          if (res[0].result === "success") {
            $('#edit').val(res[0].todos['0']['content'])
            $('.editing_id').val(res[0].todos['0']['id'])
          }
        }
      });
    }

    // 取消編輯
    if (e.target.classList.contains('editing_cancel')) {
      $('.editing_area').css('display', 'none');
      $('.editing_background').css('display', 'none');
    }
  });
});