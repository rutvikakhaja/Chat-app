let users = [];
function userJoin(id, username, room){
    // Check for existing user
  const existingUser = users.find(
    (user) => user.room === room && user.username === username
  );
  //validate username
  if (existingUser) {
    console.log("Username is same");
   
  }
    const user= {id, username, room};
    users.push(user);
    return user;
}

function getCurrentUser(id){
    return users.find(user=>user.id === id);
}

// get users leave chat
function userLeave(id){
    const index = users.findIndex(user=> user.id === id);
    if(index !== -1){
        return users.splice(index,1)[0];
    }   
}

// Get room users
function getRoomsUsers(room){
    return users.filter(user=> user.room === room);
}
module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomsUsers
}