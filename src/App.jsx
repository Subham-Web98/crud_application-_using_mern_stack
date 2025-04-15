import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const App = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const databaseURL = `crud-app-backend-express-and-mongo-db.vercel.app
`;

  const updateUser = (user) => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setMessage(user.message);
    setIsEdit(true);
    setEditingId(user._id);
  };

  const formHandler = async (e) => {
    e.preventDefault();
    const formData = {
      name,
      email,
      phone,
      message,
    };

    //* Add user - post
    try {
      if (editingId) {
        await axios.put(`${databaseURL}/user-update/${editingId}`, formData);
        toast.success("Successfully User Updated");
        allUsers();
      } else {
        await axios.post(`${databaseURL}/user-insert`, formData);
        toast.success("User Added Successfully");
        allUsers();
      }
    } catch (error) {
      console.log(`Something went wrong : ${error}`);
      toast.error("Something went wrong");
    }

    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setIsEdit(false);
    setEditingId(null);
  };

  //* All Users List - get
  const allUsers = async () => {
    try {
      const users = await axios.get(`${databaseURL}/users-view`);
      setUsersList(users.data.data);
    } catch (error) {
      console.log(`Somthig went wrong :${error}`);
    }
  };

  //* Delete User - delete
  const deleteUser = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure you want to delete?",
        text: "This action cannot be undone.",
        icon: "warning",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
        denyButtonText: "No, Cancel",
      });

      if (result.isConfirmed) {
        await axios.delete(`${databaseURL}/user-delete/${id}`);
        toast.success("User Deleted Successfully");
        allUsers();
        Swal.fire("Deleted!", "User has been removed.", "success");
      } else if (result.isDenied) {
        Swal.fire("Cancelled", "User was not deleted.", "info");
      }
    } catch (error) {
      console.log(`Something went wrong ${error}`);
      toast.error("Failed to delete, try again!");
    }
  };


  //* Delete All Users

  const deleteAllUsers = async () => {
    const adminPassword = "subhamMERN";

    try {
      const { value: password } = await Swal.fire({
        title: "Enter Admin Password",
        input: "password",
        inputPlaceholder: "Enter password",
        inputAttributes: {
          maxlength: "10",
          autocapitalize: "off",
          autocorrect: "off",
        },
        showCancelButton: true,
      });

      if (!password) return; // If user cancelled or input empty
      if (password === adminPassword) {
        await axios.delete(`${databaseURL}/all-user-delete`);
        toast.success("Successfully deleted all users");
        allUsers(); // Refresh list
      } else {
        Swal.fire({
          icon: "error",
          title: "Wrong Password",
          text: "You are not authorized to perform this action.",
        });
      }
    } catch (error) {
      console.log(`Something went wrong: ${error}`);
      toast.error("Something went wrong, try again!");
    }
  };

  useEffect(() => {
    console.log("render");
    allUsers();
  }, []);

  console.log(usersList);
  return (
    <>
      {/* User Form */}
      <section className=" container d-flex justify-content-center flex-column mt-3">
        <h1 className="text-center text-secondary fs-1 fw-bold my-2 rounded-3 shadow-sm bg-opacity-25 py-2 px-2">
          CRUD Application using <br /> React and Express
        </h1>
        <form className="user-form" onSubmit={formHandler}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="form-control"
              id="username"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="useremail" className="form-label">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="form-control"
              id="useremail"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="user-phone" className="form-label">
              Phone
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              className="form-control"
              id="user-phone"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="usermessage" className="form-label">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="form-control"
              id="usermessage"
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            {isEdit ? "Save" : "Submit"}
          </button>
          <ToastContainer position="top-right" autoClose={5000} />
        </form>
      </section>
      {/* User List Table */}
      <section className="container my-5">
        <div className="table-responsive">
          <table className="table text-center table-bordered">
            <thead className="table-dark">
              <tr className="text-center">
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Message</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {usersList.length > 0 ? (
                usersList.map((user, index) => (
                  <tr key={index} className="">
                    <th scope="row">{index + 1}</th>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>+91 {user.phone}</td>
                    <td> {user.message}</td>
                    <td>
                      <button
                        onClick={() => updateUser(user)}
                        className="btn btn-outline-info btn-sm"
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => deleteUser(user._id)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-center fs-4 fw-bold text-danger">
                  <td colSpan="7" className="text-center text-danger my-5 py-5">
                    No User Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="text-end my-4">
          <button onClick={deleteAllUsers} className="btn btn-outline-danger">
            Delete All Users
          </button>
        </div>
      </section>
    </>
  );
};

export default App;
