
console.log('adasd');
const data = {
    "email": "admin@gmail.com",
    "password": "123123"
}
async function login() {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
      headers: {
      'Content-Type': 'application/json'
      },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });

  const reeeesData = await response.json();
  console.log(reeeesData);
  localStorage.setItem('token', reeeesData.accessToken);
}
async function asad() {
  const response = await fetch('http://localhost:3000/api/transactions', {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
       headers: {
      'Content-Type': 'application/json',
      'x-auth': localStorage.getItem('token')
    }
  });

  const reeeesData = await response.json();
  console.log(reeeesData);
}

login();
setTimeout(asad(), 10000);
