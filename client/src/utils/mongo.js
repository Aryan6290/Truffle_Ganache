



export const addUsers =(users)=>{
    let newUsers = []
  newUsers.push({
    name : 'Aryan',
    id : users[1]
  })
  newUsers.push({
    name : 'Aniket',
    id : users[2]
  })
  newUsers.push({
    name : 'Shivam',
    id : users[3]
  })
  newUsers.push({
    name : 'Deepak',
    id : users[4]
  })
  newUsers.push({
    name : 'Shekhar',
    id : users[5]
  })
  return newUsers;

}

export const getUsers = async()=>{
  let users = null;
  console.log("called")
  fetch('http://localhost:4000/api/user/all',{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(response => {
    if (response.status === 200) {
      response.json().then(e => console.log(e))
      // Do something with the successful response
    } else {
      console.log('Response status is not 200 OK');
      // Handle the response error
    }
  })
  .catch(error => {
    console.log('Error occurred:', error);
    // Handle any network or request errors
  });
//   const uniqueData = users.filter((obj, index, self) =>
//   index === self.findIndex(item => item.name === obj.name)
// );

return users;
}