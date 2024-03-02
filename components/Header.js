import { Fragment, useState } from 'react';
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react';
import {
    ArrowPathIcon,
    Bars3Icon,
    ChartPieIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { useRouter } from 'next/router';
import productApi from '@/pages/api/apiProduct';

const products = [
    { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: ChartPieIcon },
    { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
    { name: 'Security', description: 'Your customers’ data will be safe and secure', href: '#', icon: FingerPrintIcon },
    { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
    { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
];
const notifications = [
    {
        name: 'Package from your order #123456 has arrived 1',
        description: 'Yesterday at 12:00 p.m',
        href: '#',
        icon: ChartPieIcon,
    },
    {
        name: 'Package from your order #123456 has arrived 1',
        description: 'Yesterday at 12:00 p.m',
        href: '#',
        icon: CursorArrowRaysIcon,
    },
    {
        name: 'Package from your order #123456 has arrived 1',
        description: 'Yesterday at 12:00 p.m',
        href: '#',
        icon: FingerPrintIcon,
    },
    {
        name: 'Package from your order #123456 has arrived 1',
        description: 'Yesterday at 12:00 p.m',
        href: '#',
        icon: SquaresPlusIcon,
    },
    {
        name: 'Package from your order #123456 has arrived 1',
        description: 'Yesterday at 12:00 p.m',
        href: '#',
        icon: ArrowPathIcon,
    },
];
const callsToAction = [
    { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
    { name: 'Contact sales', href: '#', icon: PhoneIcon },
];
function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}
function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLogged, setIsisLogged] = useState(false);
    const router = useRouter();
    const [searchValue, setSearchValue] = useState('');

    const checkLogged = () => {
        setIsisLogged(!isLogged);
    };
    const searchProduct = () => {
        router.push(`/product/searchProduct?search_query=${encodeURIComponent(searchValue)}`);
    };
    return (
        <header className="bg-white shadow-2xl fixed z-10 left-0 right-0 top-0">
            <nav className="mx-auto flex max-w-full items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img className="h-8 w-auto" src="/img/logoTKDecor.png" alt="" />
                    </a>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <Popover.Group className="hidden lg:flex lg:gap-x-12">
                    <div className="flex flex-row items-center justify-center gap-x-6">
                        <a href="#" className="font-bold text-xl leading-2 text-gray-900">
                            HOME
                        </a>
                        <Popover className="relative">
                            <Popover.Button className="flex items-center gap-x-1 font-bold text-xl leading-2 text-gray-900 outline-none">
                                PRODUCT
                                {/* <ChevronDownIcon className="h-5 w-5 flex-none text-black" aria-hidden="true" /> */}
                                <Image className="w-6 h-6 px-1" alt="svg" src="/svgs/down.svg" width={2} height={2} />
                            </Popover.Button>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                                    <div className="p-4">
                                        {products.map((item) => (
                                            <div
                                                key={item.name}
                                                className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-2 hover:bg-gray-50"
                                            >
                                                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                    <item.icon
                                                        className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                                                        aria-hidden="true"
                                                    />
                                                </div>
                                                <div className="flex-auto">
                                                    <a href={item.href} className="block font-semibold text-gray-900">
                                                        {item.name}
                                                        <span className="absolute inset-0" />
                                                    </a>
                                                    <p className="mt-1 text-gray-600">{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                                        {callsToAction.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-2 text-gray-900 hover:bg-gray-100"
                                            >
                                                <item.icon
                                                    className="h-5 w-5 flex-none text-gray-400"
                                                    aria-hidden="true"
                                                />
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </Popover>

                        <a href="#" className="font-bold text-xl leading-2 text-gray-900">
                            NEW
                        </a>
                        <a href="#" className="font-bold text-xl leading-2 text-gray-900">
                            ABOUT
                        </a>
                        <a href="#" className="font-bold text-xl  leading-2 text-gray-900">
                            CONTACT
                        </a>
                        <select className="border-none shadow-sm outline-none appearance-none focus:text-black font-bold focus:ring-0 focus:border-gray-300 focus:bg-[#D9D9D940] rounded-xl">
                            <option>EN (English)</option>
                            <option>VI (Tiếng Việt)</option>
                        </select>
                        <feColorMatrix>
                            <label
                                htmlFor="search"
                                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                            >
                                Search
                            </label>
                            <form>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 flex items-center pl-3 "
                                        onClick={searchProduct}
                                    >
                                        <img className="h-6" src="/assets/svg/search.svg" alt="logo" />
                                    </div>
                                    <input
                                        id="search"
                                        className="block w-full p-4 pl-14 text-sm text-gray-900 border border-gray-300 rounded-full outline-none appearance-none h-10 "
                                        placeholder="What are you looking for?"
                                        onChange={(event) => setSearchValue(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                searchProduct(); // Gọi hàm searchProduct khi người dùng nhấn Enter trong ô input
                                            }
                                        }}
                                    />
                                </div>
                            </form>
                        </feColorMatrix>
                    </div>
                </Popover.Group>
                <div>
                    {true ? (
                        <div className="pl-8">
                            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                                <a href="#" className="font-bold text-xl leading-2 text-gray-900">
                                    LOGIN
                                </a>
                                <a className="border border-r border-black mx-4"></a>
                                <a href="#" className="font-bold text-xl leading-2 text-gray-900">
                                    SIGN UP
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-x-4 pl-12">
                            <Popover className="relative">
                                <Popover.Button className="flex items-center gap-x-1 font-bold text-xl leading-2 focus:border-none focus:outline-none focus:in focus:bg-[#A69689]">
                                    <Image
                                        className="w-8 h-8 px-1 focus:border-none focus:bg-[#A69689] "
                                        alt="svg"
                                        src="/svgs/bell.svg"
                                        width={2}
                                        height={2}
                                    />
                                </Popover.Button>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                >
                                    <Popover.Panel className="absolute -left-80 top-full z-10 mt-3 w-screen max-w-sm overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                                        <div className="p-4">
                                            <div className="inline-flex w-full">
                                                <p className="font-inter text-lg font-semibold">Notifications</p>
                                                <p className="ml-auto mr-0 font-normal text-xs text-[#A69689]">
                                                    Mark all as read
                                                </p>
                                            </div>
                                            {notifications.map((item) => (
                                                <div
                                                    key={item.name}
                                                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-xs leading-2 hover:bg-gray-50"
                                                >
                                                    <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                        <item.icon
                                                            className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                                                            aria-hidden="true"
                                                        />
                                                    </div>
                                                    <div className="flex-auto">
                                                        <a
                                                            href={item.href}
                                                            className="block font-semibold text-gray-900"
                                                        >
                                                            {item.name}
                                                            <span className="absolute inset-0" />
                                                        </a>
                                                        <p className="mt-1 text-gray-600">{item.description}</p>
                                                        <p className="border-b"></p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <a className="mx-4 p-6 text-sm font-medium text-gray-900" href="#">
                                            View all notifications
                                        </a>
                                    </Popover.Panel>
                                </Transition>
                                <button>Logout</button>
                            </Popover>
                            <a href="#" className="font-bold text-xl leading-2 text-gray-900">
                                <Image className="w-8 h-8 px-1" alt="svg" src="/svgs/cart.svg" width={2} height={2} />
                            </a>
                            <Image className="w-8 h-8 px-1" alt="svg" src="/svgs/user1.svg" width={2} height={2} />
                        </div>
                    )}
                </div>
            </nav>
            <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="fixed inset-0 z-10" />
                <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                className="h-8 w-auto"
                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                alt=""
                            />
                        </a>
                        <button
                            type="button"
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                <Disclosure as="div" className="-mx-3">
                                    {({ open }) => (
                                        <>
                                            <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                                                Product
                                                <ChevronDownIcon
                                                    className={classNames(
                                                        open ? 'rotate-180' : '',
                                                        'h-5 w-5 flex-none',
                                                    )}
                                                    aria-hidden="true"
                                                />
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="mt-2 space-y-2">
                                                {[...products, ...callsToAction].map((item) => (
                                                    <Disclosure.Button
                                                        key={item.name}
                                                        as="a"
                                                        href={item.href}
                                                        className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                                    >
                                                        {item.name}
                                                    </Disclosure.Button>
                                                ))}
                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    HOME
                                </a>
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Marketplace
                                </a>
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Company
                                </a>
                            </div>
                            <div className="py-6">
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Log in
                                </a>
                            </div>
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </header>
    );
}
export default Header;
