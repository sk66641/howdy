import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteProfileImageAsync, selectLoggedInUser, updateProfileImageAsync } from '../auth/authSlice';
import { IoMdArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { colors } from '../../lib/utils';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { updateProfileAsync } from '../auth/authSlice';

const Profile = () => {

  const user = useSelector(selectLoggedInUser);
  const [selectedColor, setSelectedColor] = useState(user.color);
  const [hovered, setHovered] = useState(false);
  // console.log(user.username);
  const [userInfo, setUserInfo] = useState({
    username: user.username || "",
    fullName: user.fullName,
    bio: user.bio,
    profileImage: user.profileImage,
    previewImage: '',
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
    dispatch(updateProfileAsync({ username: userInfo.username, fullName: userInfo.fullName, color: selectedColor, bio: userInfo.bio }));
    navigate('/');
  }

  const handleFileInputClick = () => {
    ref.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
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

      const preview = URL.createObjectURL(file);
      setUserInfo({
        ...userInfo,
        previewImage: preview,
      });

      dispatch(updateProfileImageAsync(formData));
    }

  };

  const handleImageDelete = () => {

    setUserInfo({
      ...userInfo,
      profileImage: '',
      previewImage: '',
    });
    dispatch(deleteProfileImageAsync());

  };

  return (
    <>
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
                      {userInfo.fullName.split('')[0]}
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
            <div></div>
            <div className='flex gap-3'>
              <input type="text" name='username' onChange={handleChange} value={userInfo.username} placeholder='Username'
                className="w-full px-4 py-3 bg-slate-700 text-slate-300 rounded-lg border border-slate-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-all duration-200"
                required />
              <input type="text" name='fullName' placeholder="Full Name" onChange={handleChange} value={userInfo.fullName}
                className="w-full px-4 py-3 bg-slate-700 text-white placeholder-slate-500 rounded-lg border border-slate-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-all duration-200" required />
            </div>
            <div>
              <input type="email" name='email' value={user.email}
                className="w-full px-4 py-3 bg-slate-700 text-slate-300 rounded-lg border border-slate-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-all duration-200"
                disabled />
            </div>
            <div>
              <input type="textArea" name='bio' onChange={handleChange} value={userInfo.bio} placeholder='Bio'
                className="w-full px-4 py-3 bg-slate-700 text-slate-300 rounded-lg border border-slate-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-all duration-200" />
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
          </form>
        </div>
      </section>
    </>
  )
}

export default Profile
