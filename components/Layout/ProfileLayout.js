import React from 'react';
import UserLayout from './UserLayout';
import { UserIcon, ClipboardDocumentListIcon, MapPinIcon, HeartIcon } from '@heroicons/react/24/outline';

const ProfileLayout = ({ children }) => {
    return (
        <div>
            <UserLayout>
                <div className="w-[86rem] max-w-full mx-auto my-16">
                    <p className="font-semibold text-xl">USER PROFILE</p>
                    <div className="mt-10 flex">
                        <ul className="basis-1/4 flex flex-col gap-9 text-black text-opacity-50 font-semibold text-xl">
                            <li className="">
                                <button className="flex gap-4">
                                    <UserIcon className="w-6 h-6" />
                                    <p>User Info</p>
                                </button>
                            </li>
                            <li>
                                <button className="flex gap-4">
                                    <MapPinIcon className="w-6 h-6" />
                                    <p>My Address</p>
                                </button>
                            </li>
                            <li className="text-black text-opacity-100">
                                <button className="flex gap-4 ">
                                    <HeartIcon className="w-6 h-6" />
                                    <p>Favorite</p>
                                </button>
                            </li>
                            <li>
                                <button className="flex gap-4">
                                    <ClipboardDocumentListIcon className="w-6 h-6" />
                                    <p>My Orders</p>
                                </button>
                            </li>
                        </ul>
                        <div className="basis-3/4">{children}</div>
                    </div>
                </div>
            </UserLayout>
        </div>
    );
};

export default ProfileLayout;
