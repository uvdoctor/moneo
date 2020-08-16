import React, { useEffect, useState } from "react";
import Logo from "./logo";
import SVGOff from "./svgoff";
import { Auth, Hub } from "aws-amplify";
import { useRouter } from "next/router";
import FullScreen from "./fullscreen";

const UserHeader = () => {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  const updateUser = (username: string | null) => {
    if (username) {
      localStorage.setItem("username", username);
      setUsername(username);
    } else {
      localStorage.removeItem("username");
      setUsername(null);
    }
  };

  const listener = (capsule: any) => {
    let eventType: string = capsule.payload.event;
    console.log("Event type: ", eventType);
    if (eventType === "signIn") updateUser(capsule.payload.data.username);
    else updateUser(null);
  };

  const getUsername = async () => {
    try {
      let user = await Auth.currentAuthenticatedUser();
      if (user) updateUser(user.username);
    } catch (e) {
      console.log("Error while logging in: ", e);
      updateUser(null);
    }
  };

  useEffect(() => {
    Hub.listen("auth", listener);
    let username = localStorage.getItem("username");
    username ? setUsername(username) : getUsername();
    return () => Hub.remove("auth", listener);
  }, []);

  const handleLogout = async (e: any) => {
    e.preventDefault();
    try {
      await Auth.signOut();
      Hub.dispatch("auth", { event: "signOut" });
    } catch (error) {
      console.log("error signing out: ", error);
    } finally {
      router.reload();
    }
  };

  //const handleHelp = () => { }

  return (
    <nav className="md:text-lg lg:text-xl fixed flex w-full bg-white items-center justify-between flex-wrap py-1 top-0 animated items-center cursor font-bold">
      <Logo />
      {username ? (
        <div className="flex items-center">
          {/*<div className="ml-8 md:ml-12 hoverable relative inline-block hover:text-green-600"><label>{username}</label>
                        <ul className="px-2 md:px-4 py-1 dropdown-menu absolute shadow-xl bg-green-600 text-white font-normal text-base md:text-lg">
                            <li className="py-1 hover:text-black">Profile</li>
                            <li className="py-1 hover:text-black">Settings</li>
                            <li className="py-1 hover:text-black" onClick={handleLogout}>Logout</li>
                        </ul>
            </div>*/}
          <FullScreen />
          {/*<div onClick={handleHelp}><a>Help</a></div>*/}
          <div className="ml-2 mr-2" onClick={handleLogout}>
            <a>
              <SVGOff />
            </a>
          </div>
        </div>
      ) : (
        <div className="mr-2 md:mr-4 text-xl md:text-2xl font-black text-green-600">
          DollarDarwin
        </div>
      )}
    </nav>
  );
};

export default UserHeader;
