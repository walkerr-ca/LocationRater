import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { useRegisterMutation, registerSchema, RegisterSchema } from "../hooks/mutations/register";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { mutate, isPending, data, error } = useRegisterMutation();
  const [input, setInput] = useState<RegisterSchema>({
    username: "",
    password: "",
    secondPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data && data.success) {
      navigate("/login");
    }
  }, [data]);

  useEffect(() => {
    const { error } = registerSchema.safeParse(input);
    if (error) {
      const errorDict: Record<string, string> = {};
      error.issues.forEach((issue) => {
        const key = issue.path.join("");
        errorDict[key] = issue.message;
      });

      setValidationErrors(errorDict);
    } else {
      setValidationErrors({});
    }
  }, [input]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "1rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IonText
            style={{
              textAlign: "center",
            }}
          >
            <h1>LocationRater</h1>
            <p>Welcome!</p>
          </IonText>
          <div
            style={{
              width: "100%",
            }}
          >
            <IonInput
              label="Username"
              labelPlacement="floating"
              fill="outline"
              placeholder="Enter username"
              value={input.username}
              onIonInput={(e) =>
                setInput({ ...input, username: (e.target.value ?? "").toString() })
              }
            />
            {validationErrors["username"] && (
              <IonText color="danger">
                <p>{validationErrors["username"]}</p>
              </IonText>
            )}
          </div>
          <div
            style={{
              width: "100%",
            }}
          >
            <IonInput
              label="Password"
              labelPlacement="floating"
              fill="outline"
              placeholder="Enter password"
              type="password"
              value={input.password}
              onIonInput={(e) =>
                setInput({ ...input, password: (e.target.value ?? "").toString() })
              }
            />
            {validationErrors["password"] && (
              <IonText color="danger">
                <p>{validationErrors["password"]}</p>
              </IonText>
            )}
          </div>
          <div
            style={{
              width: "100%",
            }}
          >
            <IonInput
              label="Confirm Password"
              labelPlacement="floating"
              fill="outline"
              placeholder="Enter password"
              type="password"
              value={input.secondPassword}
              onIonInput={(e) =>
                setInput({ ...input, secondPassword: (e.target.value ?? "").toString() })
              }
            />
            {validationErrors["secondPassword"] && (
              <IonText color="danger">
                <p>{validationErrors["secondPassword"]}</p>
              </IonText>
            )}
          </div>
          {error && (
            <IonText color="danger">
              <p>{error.message}</p>
            </IonText>
          )}
          <IonButton
            color="primary"
            onClick={() => mutate(input)}
            disabled={isPending || Object.keys(validationErrors).length > 0}
          >
            Register
          </IonButton>
          <Link to="/login">
            <IonButton color="primary">Login</IonButton>
          </Link>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
