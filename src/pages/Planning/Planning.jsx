import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiShare2, FiSettings } from "react-icons/fi";
import colors from "tailwindcss/colors";
import { v4 as uuidV4 } from "uuid";
import { GoCheck } from "react-icons/go";
import { VscChevronDown } from "react-icons/vsc";
import { FiLogOut } from "react-icons/fi";
import { MdRefresh } from "react-icons/md";
import { VscEye } from "react-icons/vsc";
import { FaUsers, FaVoteYea, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";

import { db, hash, PLANNING_SCHEMA } from "../../utils/db";
import CONST from "../../utils/constants";
import Logo from "../../components/shared/Logo/Logo";
import Button from "../../components/forms/Button/Button";
import StartPlanning from "../../components/ui/landing/StartPlanning/StartPlanning";
import SlideUpModal from "../../components/shared/SlideUpModal/SlideUpModal";
import PopUpModal from "../../components/shared/PopUpModal/PopUpModal";
import Input from "../../components/forms/Input/Input";
import tailwindcssConfig from "../../assets/config/tailwindcss.json";

const Planning = () => {
  const { push, location } = useHistory();

  const [planningData, setPlanningData] = useState(PLANNING_SCHEMA);
  const [users, setUsers] = useState({});
  const [role, setRole] = useState(CONST.USER);
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [isSpectator, setIsSpectator] = useState(false);
  const [showSlideUpModal, setShowSlideUpModal] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [isVoted, setIsVoted] = useState(null);
  const [result, setResult] = useState({
    totalPaticipants: 0,
    totalSpectators: 0,
    totalVotes: 0,
    votingMap: {},
  });

  useEffect(() => {
    const query = new URLSearchParams(location.search);

    if (!query.get("room")) {
      push(CONST.LANDING);
    }

    localStorage.setItem(CONST.ROOM_ID, query.get("room"));

    if (!localStorage.getItem(CONST.USER_ID)) {
      setShowModal(true);
    } else {
      listenPlanningDataChanges();
    }
  }, []);

  useEffect(() => {
    let totalPaticipants = 0;
    let totalSpectators = 0;
    let totalVotes = 0;
    let votingMap = {};

    Object.values(users).forEach((user) => {
      if (!user.isSpectator) {
        totalPaticipants++;
      }
      if (user.isSpectator) {
        totalSpectators++;
      }
      if (user.vote !== null) {
        totalVotes++;
      }

      if (!votingMap[user.vote]) {
        votingMap[user.vote] = 1;
      } else {
        votingMap[user.vote]++;
      }
    });

    setResult({
      ...result,
      totalPaticipants,
      totalSpectators,
      totalVotes,
      votingMap,
    });
  }, [users]);

  const listenPlanningDataChanges = () => {
    const query = new URLSearchParams(location.search);

    db.get(query.get("room"))
      .map()
      .on(async (response) => {
        if (!response) return;

        const data = await SEA.decrypt(response, hash);

        setPlanningData(data);
      });

    db.get(`${query.get("room")}-users`)
      .map()
      .on(async (response) => {
        if (!response) return;

        const user = await SEA.decrypt(response, hash);

        if (user.id === localStorage.getItem(CONST.USER_ID)) {
          if (user.admin) {
            setRole(CONST.ADMIN);
          }
          setUserName(user.name);
          setIsSpectator(user.isSpectator);
          setIsVoted(user.vote);
        }

        users[user.id] = { ...user };
        setUsers({ ...users });
      });
  };

  const joinUserToRoom = async () => {
    if (!userName) {
      toast.error("Name is required");
      return;
    }

    const query = new URLSearchParams(location.search);
    const userId = localStorage.getItem(CONST.USER_ID);

    if (userId) {
      users[userId].name = userName;
      users[userId].isSpectator = isSpectator;

      if (users[userId].isSpectator) {
        users[userId].vote = null;
        setIsVoted(null);
      }

      const userSecret = await SEA.encrypt(
        JSON.stringify({
          ...users[userId],
        }),
        hash
      );

      db.get(`${query.get("room")}-users`).put({ [userId]: userSecret });
      setShowModal(false);
    } else {
      const id = uuidV4();
      const userSecret = await SEA.encrypt(
        JSON.stringify({
          id,
          name: userName,
          isSpectator: isSpectator,
          vote: null,
        }),
        hash
      );

      db.get(`${query.get("room")}-users`).put({ [id]: userSecret });
      localStorage.setItem(CONST.USER_ID, id);

      listenPlanningDataChanges();
      setShowModal(false);
    }
  };

  const selectVote = async (voting, index) => {
    if (planningData.showVoting) return;

    const query = new URLSearchParams(location.search);
    const userId = localStorage.getItem(CONST.USER_ID);

    users[userId].vote = voting.name;
    setIsVoted(index);

    const userSecret = await SEA.encrypt(
      JSON.stringify({
        ...users[userId],
      }),
      hash
    );
    db.get(`${query.get("room")}-users`).put({ [userId]: userSecret });
  };

  const onShowVoting = async () => {
    if (role !== CONST.ADMIN) return;

    const query = new URLSearchParams(location.search);
    const userId = localStorage.getItem(CONST.USER_ID);

    if (users[userId]?.admin) {
      planningData.showVoting = true;
    }

    const planningSecret = await SEA.encrypt(
      JSON.stringify(planningData),
      hash
    );
    db.get(query.get("room")).put({ data: planningSecret });
  };

  const onVotingReset = async () => {
    if (role !== CONST.ADMIN) return;

    const query = new URLSearchParams(location.search);
    const userId = localStorage.getItem(CONST.USER_ID);

    if (users[userId]?.admin) {
      planningData.showVoting = false;

      Object.keys(users).forEach(async (key) => {
        users[key].vote = null;
        const userSecret = await SEA.encrypt(
          JSON.stringify({
            ...users[key],
          }),
          hash
        );
        db.get(`${query.get("room")}-users`).put({ [key]: userSecret });
      });
    }

    const planningSecret = await SEA.encrypt(
      JSON.stringify(planningData),
      hash
    );
    db.get(query.get("room")).put({ data: planningSecret });
  };

  const editStartPlanning = async (data) => {
    if (role !== CONST.ADMIN) return;

    const query = new URLSearchParams(location.search);
    const userId = localStorage.getItem(CONST.USER_ID);

    if (users[userId].admin) {
      planningData.planningName = data.planningName;
      planningData.votingSystem = data.votingSystem;

      const secret = await SEA.encrypt(JSON.stringify(planningData), hash);
      db.get(query.get("room")).put({ data: secret });

      setShowSlideUpModal(false);
    }
  };

  const copyLink = () => {
    const copyText = document.getElementById("share-url");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    toast.info("Link Copied.");
  };

  const onLogout = () => {
    localStorage.removeItem(CONST.USER_ID);
    localStorage.removeItem(CONST.ROOM_ID);
    push(CONST.LANDING);
  };

  const isMobile =
    document.body.offsetWidth <= parseInt(tailwindcssConfig.screens.mobile.max);

  return (
    <>
      <div className="w-full h-auto flex flex-row justify-between items-center px-6 pt-8 pb-6 mobile:p-4 tablet:p-4 outline-none">
        <div className="flex flex-row justify-center items-center">
          <Link to={CONST.LANDING}>
            <Logo
              color="blue"
              colorWeight="400"
              logoTitle={planningData.planningName}
              hideTitleInMobile
            />
          </Link>
          {role === CONST.ADMIN ? (
            <SlideUpModal
              showSlideUpModal={showSlideUpModal}
              action={
                <FiSettings
                  fontSize="24"
                  className="mobile:text-xl ml-4 text-gray-800"
                />
              }
              actionHandler={(data) => {
                setShowSlideUpModal(data);
              }}
              header={<Logo color="blue" colorWeight="400" />}
            >
              <StartPlanning
                submitText="UPDATE"
                editMode
                editPlanningName={planningData.planningName}
                editVotingSystem={planningData.votingSystem}
                editSubmitHandler={editStartPlanning}
              />
            </SlideUpModal>
          ) : null}
        </div>
        <div className="flex flex-row items-center">
          <div className="flex flex-row mr-4 mobile:mr-2 items-center">
            <div
              className="flex flex-row items-center relative hover:bg-gray-100 focus:bg-gray-100 p-2 mobile:p-0 mobile:ml-2 rounded outline-none"
              onClick={() => setShowDropDown(!showDropDown)}
              tabIndex="-1"
              onBlur={() => setShowDropDown(false)}
            >
              <p className="uppercase text-sm rounded-full bg-blue-400 w-7 h-7 flex flex-row justify-center items-center mr-2 text-white">
                {userName[0]}
              </p>
              <p className="cursor-pointer mr-2 capitalize mobile:hidden">
                {userName}
              </p>
              <VscChevronDown className="cursor-pointer" strokeWidth={2} />
              {showDropDown ? (
                <>
                  <div className="w-56 h-56 rounded shadow-lg bg-white absolute top-14 mobile:top-8 right-0 mobile:-right-16 z-10 border">
                    <div className="w-full h-auto flex flex-row p-2">
                      <p className="flex flex-row justify-center items-center text-xl uppercase rounded-full bg-blue-400 w-12 h-12 mr-2 text-white">
                        {userName[0]}
                      </p>
                      <div className="flex flex-col justify-center items-start">
                        <p className="cursor-pointer mr-2 capitalize">
                          {userName}
                        </p>
                        <div
                          className="bg-yellow-400 text-white text-sm px-2 rounded cursor-pointer"
                          onClick={() => setShowModal(true)}
                        >
                          <p>edit</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-auto border-t p-2 flex flex-row items-center">
                      <FiLogOut />
                      <p className="ml-2 cursor-pointer" onClick={onLogout}>
                        Logout
                      </p>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <div onClick={copyLink}>
            <input
              type="text"
              id="share-url"
              style={{ fontSize: 0, width: 0, height: 0 }}
              value={window.location.href}
              autoFocus={false}
              readOnly
            />
            <Button bgColor="blue" bgColorWeight="400" textColor="white">
              <FiShare2 fontSize="20" className="text-base mr-2 relative" />
              <span className="mobile:text-xs">Copy link</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full h-[calc(100vh-96px)] mobile:h-[calc(100vh-64px)] tablet:h-[calc(100vh-76px)] px-6 mobile:px-4 tablet:px-4 pb-6 mobile:pb-4 tablet:pb-4 flex flex-row mobile:flex-col-reverse mobile:justify-start overflow-hidden">
        <div className="w-3/4 mobile:w-full h-full mobile:h-3/4 mobile:mt-2 flex flex-col justify-between">
          <div
            className="w-full h-3/4 mobile:h-4/5 grid grid-cols-4 mobile:grid-cols-2 tablet:grid-cols-3 gap-4 mobile:gap-1 border-2 border-blue-400 rounded shadow p-2 overflow-x-hidden overflow-y-scroll relative"
            style={{ gridAutoRows: "100px" }}
          >
            {Object.keys(users).length > 0 ? (
              Object.values(users).map((user, index) => (
                <div
                  key={[index].join("_")}
                  className="w-auto h-16 border rounded shadow flex flex-row relative"
                >
                  <div
                    className="w-1/5 mobile:w-1/4 flex flex-row justify-center items-center rounded m-px"
                    style={{
                      background: user.vote
                        ? colors["blue"]["400"]
                        : colors["gray"]["200"],
                    }}
                  >
                    <p className="font-bold text-3xl mobile:text-lg text-white break-words">
                      {user.vote && planningData.showVoting ? user.vote : null}
                    </p>
                  </div>
                  <div className="w-4/5 mobile:w-3/4 flex flex-col p-2">
                    <p className="capitalize mobile:text-xs">{user.name}</p>
                    <p className="opacity-50 text-sm mobile:text-xs">
                      {user.isSpectator ? "Spectator" : "Participant"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full h-full absolute top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center">
                <p>Waiting for team to join...</p>
              </div>
            )}
          </div>
          <div className="w-full h-1/4 mobile:h-1/5 flex flex-row justify-evenly items-center gap-2 mobile:gap-0 pt-4 relative">
            {isSpectator ? (
              <div
                className="rounded z-10 absolute top-4 left-0 right-0 w-full opacity-80 bg-gray-200 flex flex-row justify-center items-center"
                style={{ height: "90%" }}
              >
                <p className="font-bold mobile:text-sm mobile:text-center">
                  You are in spectator mode,{" "}
                  <span
                    className="cursor-pointer text-blue-400"
                    onClick={() => setShowModal(true)}
                  >
                    Click here
                  </span>{" "}
                  to change the mode.
                </p>
              </div>
            ) : null}
            {planningData?.votingSystem &&
              planningData.votingSystem.map((v, i) => (
                <div
                  key={i}
                  className="w-20 mobile:w-auto h-full mobile:px-1 mobile:py-1 mobile:text-xs rounded shadow bg-white border-2 border-blue-400 flex flex-row justify-center items-center hover:-translate-y-2 hover:bg-blue-50 text-blue-400 font-bold cursor-pointer"
                  style={
                    isVoted === v.name
                      ? {
                        transform: "translateY(-0.5rem)",
                        background: colors["blue"]["50"],
                      }
                      : planningData.showVoting
                        ? {
                          transform: "translateY(0)",
                          background: "transparent",
                        }
                        : {}
                  }
                  onClick={() => selectVote(v)}
                >
                  {v.name}
                </div>
              ))}
          </div>
        </div>
        <div className="w-1/4 mobile:w-full h-full mobile:h-1/4 flex flex-col mobile:flex-row-reverse pl-4 mobile:pl-0 tablet:pl-2">
          {role === CONST.ADMIN ? (
            <div className="w-full mobile:w-1/5 flex flex-row mobile:flex-col items-center mobile:justify-center mb-4 mobile:mb-0">
              <div className="w-1/2 mobile:h-1/2 mr-2 mobile:mr-0 mobile:mb-2 tablet:mr-1 mobile:w-1/2">
                <Button
                  bgColor="yellow"
                  bgColorWeight="400"
                  textColor="white"
                  onClick={onVotingReset}
                  fullWidth={true}
                  fullHeight={isMobile}
                  className="mobile:text-xs tablet:text-sm"
                >
                  <MdRefresh
                    className="mr-2"
                    fontSize={16}
                    className="mobile:text-2xl"
                  />
                  <span className="mobile:hidden">Reset</span>
                </Button>
              </div>
              <div className="w-1/2 mobile:h-1/2 ml-2 mobile:ml-0 mobile:mt-2 tablet:ml-1 mobile:w-1/2">
                <Button
                  bgColor="green"
                  bgColorWeight="400"
                  textColor="white"
                  onClick={onShowVoting}
                  fullWidth={true}
                  fullHeight={isMobile}
                  className="mobile:text-xs tablet:text-sm"
                >
                  <VscEye
                    className="mr-2"
                    fontSize={16}
                    className="mobile:text-2xl"
                  />
                  <span className="mobile:hidden">Show</span>
                </Button>
              </div>
            </div>
          ) : null}
          <div className="w-full mobile:w-4/5 h-auto mobile:max-h-44 rounded shadow border-2 border-blue-400 p-4 mobile:p-2 tablet:px-0.5 tablet:py-2 mobile:mb-0 mobile:overflow-y-auto">
            <div className="flex flex-row justify-between">
              <div className="w-1/3 h-auto flex flex-col justify-center items-center">
                <div>
                  <FaUsers
                    fontSize={20}
                    className="mobile:text-lg tablet:text-lg"
                  />
                </div>
                <div>
                  <p className="text-xl mobile:text-sm tablet:text-sm font-bold">
                    {result.totalPaticipants}
                  </p>
                </div>
                <div>
                  <p className="text-xs tablet:text-[10px] opacity-50">
                    Participant's
                  </p>
                </div>
              </div>
              <div className="w-1/3 h-auto flex flex-col justify-center items-center">
                <div>
                  <FaEye
                    fontSize={20}
                    className="mobile:text-lg tablet:text-lg"
                  />
                </div>
                <div>
                  <p className="text-xl mobile:text-sm tablet:text-sm font-bold">
                    {result.totalSpectators}
                  </p>
                </div>
                <div>
                  <p className="text-xs tablet:text-[10px] opacity-50">
                    Spectator's
                  </p>
                </div>
              </div>
              <div className="w-1/3 h-auto flex flex-col justify-center items-center">
                <div>
                  <FaVoteYea
                    fontSize={20}
                    className="mobile:text-lg tablet:text-lg"
                  />
                </div>
                <div>
                  <p className="text-xl mobile:text-sm tablet:text-sm font-bold">
                    {result.totalVotes}
                  </p>
                </div>
                <div>
                  <p className="text-xs tablet:text-[10px] opacity-50">
                    Vote's
                  </p>
                </div>
              </div>
            </div>
            {result.votingMap && planningData.showVoting
              ? Object.keys(result.votingMap)
                .sort((a, b) => {
                  if (parseFloat(a) > parseFloat(b)) return 1;
                  if (parseFloat(a) < parseFloat(b)) return -1;
                  if (parseFloat(a) == parseFloat(b)) {
                    return 0;
                  }
                })
                .map((voting) => (
                  <div
                    key={voting}
                    className="flex flex-row items-center justify-evenly mt-4 mobile:mt-2"
                  >
                    {voting !== "null" ? (
                      <>
                        <div className="w-8 h-10 border-2 border-blue-400 rounded flex flex-row justify-center items-center">
                          <p className="text-blue-400">{voting}</p>
                        </div>
                        <div
                          className="w-4/5 h-2 ml-2 bg-gray-200 rounded"
                          style={{
                            background: `linear-gradient(90deg, ${colors["blue"]["400"]
                              } 0% ${(result.votingMap[voting] /
                                (result.totalVotes === 0
                                  ? 1
                                  : result.totalVotes)) *
                              100
                              }%, ${colors["gray"]["200"]} 0% 100%)`,
                          }}
                        ></div>
                      </>
                    ) : null}
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
      <PopUpModal
        showModal={showModal}
        disableAction
        header="Personal Details"
        actionHandler={(status) => {
          if (!localStorage.getItem(CONST.USER_ID)) {
            push(CONST.LANDING);
            return;
          } else {
            setUserName(users[localStorage.getItem(CONST.USER_ID)]?.name);
            setShowModal(false);
          }
        }}
      >
        <div>
          <div className="w-full h-auto mt-4">
            <label htmlFor="scrumMasterName" className="opacity-50">
              Name
            </label>
            <Input
              id="scrumMasterName"
              className="h-12"
              placeholder="Enter name"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
            />
          </div>
          <div className="w-full h-auto mt-4 customCheckbox customCheckboxBlue flex flex-row relative">
            <input
              id="isSpectator"
              type="checkbox"
              className="opacity-0 absolute w-5 h-5"
              checked={isSpectator}
              onChange={(event) => setIsSpectator(event.target.checked)}
            />
            <div className="w-5 h-5 flex flex-shrink-0 justify-center items-center rounded bg-white border-2 border-blue-400 focus-within:bg-blue-400">
              <GoCheck className="hidden text-white" />
            </div>
            <label htmlFor="isSpectator" className="ml-2">
              Only Spectate?
            </label>
          </div>
          <div className="w-full h-12 mt-6">
            <Button
              fullWidth
              fullHeight
              bgColor="blue"
              textColor="white"
              onClick={joinUserToRoom}
            >
              CONTINUE
            </Button>
          </div>
        </div>
      </PopUpModal>
    </>
  );
};

export default Planning;
