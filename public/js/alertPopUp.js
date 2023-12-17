// function confirmBlockUnblock(userId, status) {
//     const action = status === 'true' ? 'Block' : 'Unblock';
//     const isConfirmed = confirm(`Are you sure you want to ${action} this user?`);
  
//     if (isConfirmed) {
//       window.location.href = `/admin/block-unblock-user?id=${userId}`;
//     }else{
//         console.log(`User chose not to ${action} the user.`);
//     }
//   }
  
function confirmBlockUnblock(userId, status, event) {
    const action = status === 'true' ? 'Block' : 'Unblock';
    const isConfirmed = confirm(`Are you sure you want to ${action} this user?`);
  
    if (!isConfirmed) {
      event.preventDefault();
      console.log(`User chose not to ${action} the user.`);
    }
  }
  

function confirmUpdateUser(event){
    const isConfirmed = confirm('Are you sure you want to edit this user?')
    if(!isConfirmed){
        event.preventDefault()
    }
}

function confirmAddUser(event){
    const isConfirmed = confirm('Are you sure you want to add this user?')
    if(!isConfirmed){
        event.preventDefault()
    }
}

function confirmUserEdit(event){
    const isConfirmed = confirm('Are you sure you want to edit this user?')
    if(!isConfirmed){
        event.preventDefault()
    }
}
