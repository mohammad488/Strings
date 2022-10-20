import React from 'react';
import { useDispatch } from 'react-redux';
import * as bi from 'react-icons/bi';
import config from '../../../config';
import { setModal } from '../../../redux/features/modal';

function Header() {
  const dispatch = useDispatch();

  return (
    <div className="py-3 px-5 grid gap-3 bg-white dark:bg-spill-900 dark:text-white/90">
      <div className="flex gap-5 justify-between items-center">
        {/* brand name */}
        <h1 className="text-2xl font-bold font-display">{config.brandName}</h1>
        <div className="flex gap-1 translate-x-1">
          {
            [
              { target: 'status', icon: <bi.BiRotateLeft /> },
              { target: 'contact', icon: <bi.BiMessageSquareDots /> },
              { target: 'minibox', icon: <bi.BiDotsVerticalRounded /> },
            ].map((elem) => (
              <button
                type="button"
                className="p-1 rounded-full hover:bg-spill-100 dark:hover:bg-spill-800"
                onClick={() => dispatch(setModal({
                  target: elem.target,
                }))}
              >
                {elem.icon}
              </button>
            ))
          }
        </div>
      </div>
      {/* search bar */}
      <label htmlFor="search" className="flex gap-3 items-center">
        <bi.BiSearchAlt />
        <input
          type="text"
          name="search"
          id="search"
          className="w-full"
          placeholder="Search chat or group in inbox"
        />
      </label>
    </div>
  );
}

export default Header;