import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as bi from 'react-icons/bi';
import * as comp from './sub';
// redux actions
import { setPage } from '../../../redux/features/page';
import { setModal } from '../../../redux/features/modal';
import { setRoom } from '../../../redux/features/chat';

function Contact() {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.page);

  const [contacts, setContacts] = useState(null);

  const handleGetContacts = async (signal) => {
    try {
      // get contacts if contact page is opened
      if (page.contact) {
        const { data } = await axios.get('/contacts', { signal });
        setContacts(data.payload);
      } else {
        // reset when page is closed
        setContacts(null);
      }
    }
    catch (error0) {
      console.error(error0.message);
    }
  };

  useEffect(() => {
    const ctrl = new AbortController();
    handleGetContacts(ctrl.signal);

    return () => {
      ctrl.abort();
    };
  }, [page.contact]);

  return (
    <div
      className={`
        ${page.contact ? 'delay-75' : '-translate-x-full'}
        transition duration-200 absolute w-full h-full z-10 grid grid-rows-[auto_1fr] overflow-hidden
        bg-white dark:bg-spill-900 dark:text-white/90
      `}
    >
      {/* sub components or modals */}
      <comp.newContact
        handleGetContacts={handleGetContacts}
      />
      {/* header */}
      <div className="h-16 px-2 grid gap-4">
        <div className="flex gap-4 items-center">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-spill-100 dark:hover:bg-spill-800"
            onClick={() => {
              dispatch(setPage({ target: 'contact' }));
            }}
          >
            <bi.BiArrowBack className="text-2xl" />
          </button>
          <h1 className="text-2xl font-bold">Contact</h1>
        </div>
      </div>
      {/* content */}
      <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-spill-200 hover:scrollbar-thumb-spill-300 dark:scrollbar-thumb-spill-700 dark:hover:scrollbar-thumb-spill-600">
        <div className="grid">
          {
            [
              { target: 'newcontact', text: 'New Contact', icon: <bi.BiUserPlus /> },
            ].map((elem) => (
              <div
                key={elem.target}
                className="grid grid-cols-[auto_1fr_auto] gap-6 p-4 items-center cursor-default border-0 border-b border-solid border-spill-200 dark:border-spill-800 hover:bg-spill-100/60 dark:hover:bg-spill-800/60"
                aria-hidden
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setModal({ target: elem.target }));
                }}
              >
                <i>{elem.icon}</i>
                <p className="font-bold">{elem.text}</p>
                { elem.target === 'newcontact' && (
                  <i><bi.BiQr /></i>
                ) }
              </div>
            ))
          }
        </div>
        <div className="grid">
          <span className="py-2 px-4 text-sm bg-spill-100/60 dark:bg-black/20">
            <p className="opacity-60">Your contact list</p>
          </span>
          {
            contacts && contacts.map((elem) => (
              <div
                key={elem._id}
                aria-hidden
                className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 items-center cursor-default border-0 border-b border-solid border-spill-200 dark:border-spill-800 hover:bg-spill-100/60 dark:hover:bg-spill-800/60"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setRoom({
                    ownersId: [elem.userId, elem.friendId],
                    roomId: elem.roomId,
                    profile: elem.profile,
                  }));
                }}
              >
                <img
                  src={`assets/images/${elem.profile.avatar}`}
                  alt={`assets/images/${elem.profile.avatar}`}
                  className="w-14 h-14 rounded-full"
                />
                <span className="overflow-hidden">
                  <h1 className="text-lg font-bold">{elem.fullname || elem.profile.fullname}</h1>
                  { elem.profile.bio.length > 0 && (
                    <p className="truncate opacity-60 mt-0.5">{elem.profile.bio}</p>
                  ) }
                </span>
                <bi.BiDotsVerticalRounded />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default Contact;
