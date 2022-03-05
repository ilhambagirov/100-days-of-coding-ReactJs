import React, { useEffect, useReducer, useState, useContext, useRef } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../context/auth-context";
import Input from "../UI/Input/Input";

const reducerEmail = (state, action) => {
  if (action.type === "EMAIL_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "EMAIL_VALID") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};

const reducerPassword = (state, action) => {
  if (action.type === "PASSWORD_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "PASSWORD_VALID") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
};

const Login = (props) => {
  const ctx = useContext(AuthContext);
  //combining two related useState hook together
  const [emailState, dispatchEmail] = useReducer(reducerEmail, {
    value: "",
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(reducerPassword, {
    value: "",
    isValid: null,
  });
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "EMAIL_INPUT", val: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "PASSWORD_INPUT", val: event.target.value });
  };
  //cleanup with useEffect
  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("settimeout");
      setFormIsValid(passwordState.isValid && emailState.isValid);
    }, 500);
    return () => {
      console.log("cleanup");
      clearTimeout(identifier);
    };
  }, [passwordState.isValid, emailState.isValid]); // trigger useEffect whenever isValid property change
  //
  const validateEmailHandler = () => {
    dispatchEmail({ type: "EMAIL_VALID" });
  };

  const validatePasswordHandler = () => {
    dispatchEmail({ type: "PASSWORD_VALID" });
  };

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      ctx.onLogin(emailState.value, passwordState.value);
    } else if (!emailState.isValid) {
      emailInputRef.current.focus();
    } else {
      passwordInputRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          type="text"
          id="email"
          state={emailState}
          htmlFor="email"
          label="Email"
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          ref={passwordInputRef}
          type="password"
          id="password"
          state={passwordState}
          htmlFor="password"
          label="Password"
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            {/* disabled={!formIsValid} */}
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
