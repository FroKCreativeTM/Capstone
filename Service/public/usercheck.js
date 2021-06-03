
async function getUser() {
    try {
      const res = await axios.get('/board');
      const users = res.data;
      console.log(users);
      const tbody = document.querySelector('#user-list tbody');
      tbody.innerHTML = '';
      users.map(function (user) {
        const row = document.createElement('tr');
        // 로우 셀 추가
        let td = document.createElement('td');
        td.textContent = user.idusers;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.name;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.Dept;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.ranking;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.tele;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.birth;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.addr;
        row.appendChild(td);
        tbody.appendChild(row);
      });
    } catch (err) {
      console.error(err);
    }
  }