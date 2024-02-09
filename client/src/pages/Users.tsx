// import React, { useEffect, useState } from "react";
// import FindAFriend from "../components/FindAFriend";
// import { User } from "../@types/users";
// import baseUrl from "../utils/baseurl";

// function Users() {
//   const [allUsers, setAllUsers] = useState<User[]>([{_id:"", email:"",createdAt:"", username:""}]);
//   useEffect(() => {
//     const fetchAllUsers = () => {
//       fetch(`${baseUrl}/api/users/all`)
//         .then((res) => res.json())
//         .then((res) => {
//           const foundUsers = res as User[];
//           setAllUsers(foundUsers);
//         })
//         .catch((error) => console.log(error));
//     };
//     fetchAllUsers();
//   }, []);

//   return(
//     <>
//     <FindAFriend/>
//     <h3>Here are all users</h3>
//     {allUsers && allUsers.map((user) => {
//         return <div key={user._id}>
//         <p>{user.email}</p>
//         </div>
//     })}
//     </>
//   )
// }

// export default Users;

