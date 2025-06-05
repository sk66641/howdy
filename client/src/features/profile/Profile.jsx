import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteProfileImageAsync, selectLoggedInUser, updateProfileImageAsync } from '../auth/authSlice';
import { IoMdArrowBack } from 'react-icons/io'
import { Navigate, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { colors } from '../../lib/utils';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { updateProfileAsync } from '../auth/authSlice';
import { NavLink } from 'react-router-dom';
// import { set } from 'mongoose';
// import { profile } from 'console';
// import { set } from 'mongoose';
// import { IoMdArrowBack } from 'react-icons/io';

const Profile = () => {

  const user = useSelector(selectLoggedInUser);
  const [selectedColor, setSelectedColor] = useState(user.color);
  console.log("selectedColor", selectedColor);
  const [hovered, setHovered] = useState(false);
  // const [formData, setFormData] = useState();
  // console.log(user);
  const [userInfo, setUserInfo] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    profileImage: user.profileImage,
    previewImage: '',
    // formData: '',
  });

  const ref = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateProfileAsync({ firstName: userInfo.firstName, lastName: userInfo.lastName, color: selectedColor, _id: user._id, profileSetup: true }));
    navigate('/');
  }

  const handleFileInputClick = () => {
    ref.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large! Must be under 5MB.");
      return;
    }

    if (file.size <= 50) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserInfo({
          ...userInfo,
          profileImage: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
    else {
      const formData = new FormData();
      formData.append('profileImage', file);
      const id = user._id;

      const preview = URL.createObjectURL(file);
      setUserInfo({
        ...userInfo,
        // formData: formData,
        previewImage: preview,
      });

      dispatch(updateProfileImageAsync({ formData, id }));
    }

  };

  const handleImageDelete = () => {

    setUserInfo({
      ...userInfo,
      profileImage: '',
      previewImage: '',
    });
    // useEffect(() => {
      dispatch(deleteProfileImageAsync(user._id));
    // }, [dispatch])
    
  };

  return (
    <>
      {/* {user.profileSetup && <Navigate to={'/'} replace />} */}
      <section id="profile-editor" className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <IoMdArrowBack className='text-white text-3xl cursor-pointer hover:text-slate-300 transition-all' onClick={() => navigate('/')} />
          </div>


          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-8">
              <div className="relative " onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                <Avatar className="h-28 w-28 rounded-full overflow-hidden">
                  {userInfo.profileImage || userInfo.previewImage ? <AvatarImage className="object-cover w-full h-full bg-black" src={userInfo.previewImage || `${import.meta.env.VITE_HOST}/${userInfo.profileImage}`} alt="profile" />
                    :
                    // <input type="file" />
                    <div className={`uppercase h-28 w-28 text-4xl border-[1px] flex items-center justify-center ${colors[selectedColor]} rounded-full`}>
                      {userInfo.firstName.split('')[0]}
                    </div>
                  }
                </Avatar>
                {hovered && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-500 rounded-full">
                    {userInfo.previewImage || userInfo.profileImage ? (
                      <FaTrash onClick={handleImageDelete} className="text-white text-3xl cursor-pointer" />
                    ) : (
                      <FaPlus onClick={handleFileInputClick} className="text-white text-3xl cursor-pointer" />
                    )}
                  </div>
                )}
                <input ref={ref} type="file" onChange={handleFileChange} className='hidden' accept='.jpg, .jpeg, .png, .svg, .webp' />
              </div>
            </div>
            {/* <form className='space-y-6'> */}
            <div>
              <input type="email" name='email' onChange={handleChange} value={user.email}
                className="w-full px-4 py-3 bg-slate-700 text-slate-300 rounded-lg border border-slate-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-all duration-200"
                disabled />
            </div>

            <div>
              <input type="text" name='firstName' placeholder="First Name" onChange={handleChange} value={userInfo.firstName}
                className="w-full px-4 py-3 bg-slate-700 text-white placeholder-slate-500 rounded-lg border border-slate-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-all duration-200" required />
            </div>

            <div>
              <input type="text" name='lastName' placeholder="Last Name" onChange={handleChange} value={userInfo.lastName}
                className="w-full px-4 py-3 bg-slate-700 text-white placeholder-slate-500 rounded-lg border border-slate-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-all duration-200" required />
            </div>

            <div className="flex justify-center space-x-4 py-4">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${selectedColor === index
                    ? "outline-white/50 outline-1"
                    : ""
                    }`}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>

            <button type='submit'
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">
              Save Changes
            </button>
            {/* </form> */}
          </form>
        </div>
      </section>
      {/* <NavLink to={'/profile'}>click</NavLink> */}
    </>
  )
}

export default Profile
