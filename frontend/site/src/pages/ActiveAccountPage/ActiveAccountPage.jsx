/* eslint-disable react/jsx-key */

import { useEffect, useRef, useState } from "react";
import styles from "./ActiveAccountPage.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { reverifyEmail, verifyEmail } from "@/redux/slices/auth";
import { toast } from "sonner";

let currentOtpIndex = 0;
export default function ActiveAccountPage() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [pasteMode, setPasteMode] = useState(false);
  // const [coundDown, setCoundDown] = useState(60);
  const [errorLocal, setErrorLocal] = useState("");
  // const [canSendNewOtpRequest, setCanSendNewOtpRequest] = useState(false);
  const { error } = useSelector((state) => state.auth);
  // const [isNewCode, setIsNewCode] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const fromPage = location.state?.from;
  const userEmail =
    fromPage === "/register"
      ? location.state?.email
      : fromPage === "/login"
      ? error?.data
      : null;

  const inputRef = useRef(null);

  const handleChange = (e) => {
    if (!pasteMode) {
      const { value } = e.target;
      console.log(value);
      const newOpt = [...otp];
      newOpt[currentOtpIndex] = value.substring(value.length - 1);
      if (!value) setActiveOtpIndex(currentOtpIndex - 1);
      else setActiveOtpIndex(currentOtpIndex + 1);
      setOtp(newOpt);

      // if (newOpt.every((val) => val )) {
      //   handleSubmit(newOpt);
      // }
    }
    setPasteMode(false);
  };
  // console.log(otp);
  const handle0nKeyDown = ({ key }, index) => {
    currentOtpIndex = index;
    if (key === "Backspace") setActiveOtpIndex(currentOtpIndex - 1);
  };

  const handlePaste = (e) => {
    setPasteMode(true);
    const pastedText = e.clipboardData.getData("text");
    if (pastedText.length === 6) {
      const newOpt = pastedText.split("");
      setOtp([...newOpt]);
      setActiveOtpIndex(5);
      // for (const [i, val] of pastedText.split('').entries()){
      //   newOpt[i] = val;
      // }
      //  if (newOpt.every((val) => val !== "")) {
      //     setOtp(newOpt);
      //     // handleSubmit(newOpt);
      //   }
    }
  };
  const requestForOTP = async () => {
    // setCoundDown(60);
    // setCanSendNewOtpRequest(false);
    dispatch(reverifyEmail({ email: userEmail }));
    toast.success("Un email vous a été envoyé");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(verifyEmail({ email: userEmail, token: otp.join("") })).then(
      ({ payload }) => {
        if (payload.success) {
          return navigate("/login");
        } else {
          setErrorLocal("session expirée");
        }
      }
    );
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  // useEffect(() => {
  //   if (canSendNewOtpRequest) return;

  //   const intervalId = setInterval(() => {
  //     setCoundDown(oldCountDown => {
  //       if (oldCountDown <= 0) {
  //         setCanSendNewOtpRequest(true);
  //         clearInterval(intervalId);

  //         return 0;
  //       }
  //       return oldCountDown - 1;
  //     });
  //   }, 1000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [canSendNewOtpRequest]);
  return (
    <div className={styles.container} id={styles.activeAccount}>
      <form className="d-flex flex-column" onSubmit={handleSubmit}>
        <h1 className="my-20 d-flex justify-content-center">
          Activation de compte
        </h1>
        <span
          style={{ fontSize: "10px" }}
          className="d-flex justify-content-center"
        >
          Saisissez le code qui vous a été envoyé lors de votre inscription
        </span>
        <div className="d-flex justify-content-center gap-10 mt-30">
          {otp.map((_, index) => (
            <div key={index}>
              <input
                ref={index === activeOtpIndex ? inputRef : null}
                type="number"
                className={styles.formInput}
                onChange={handleChange}
                onKeyDown={(e) => handle0nKeyDown(e, index)}
                onPaste={handlePaste}
                value={otp[index]}
              />
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-center align-items-center px-10">
          {/* <span  className={`${styles.formSpan} mt-30`} >{coundDown > 0 ? `${coundDown } sec` : null}</span> */}
          {/* <span  style={{opacity: canSendNewOtpRequest ? 1 : 0.4}}  className={`${styles.formSpan} ${ canSendNewOtpRequest ? 'cursor-pointer' : ''}  mt-30 ml-20`} onClick={() => requestForOTP() } >Renvoyer le code</span> */}
          <span
            className={`${styles.formSpan} cursor-pointer mt-5`}
            onClick={() => requestForOTP()}
          >
            Renvoyer le code
          </span>
        </div>
        {errorLocal && (
          <span className="text-danger mx-5 text-error d-flex justify-content-center">
            {errorLocal}
          </span>
        )}
        <button
          className={`${styles.button} cursor-pointer mt-30 d-flex justify-content-center`}
        >
          Vérifier le code
        </button>
      </form>
    </div>
  );
}
