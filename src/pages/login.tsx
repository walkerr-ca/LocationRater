import { useEffect, useState } from "react";
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

import { useLoginMutation, LoginSchema, loginSchema } from "../hooks/mutations/login";
import { useAuth } from "../hooks/auth";

const Login: React.FC = () => {
  const { setAccessToken } = useAuth();
  const { mutate, isPending, data, error } = useLoginMutation();
  const [input, setInput] = useState<LoginSchema>({
    username: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data && data.success) {
      setAccessToken(data.result.token);
    }
  }, [data]);

  useEffect(() => {
    const { error } = loginSchema.safeParse(input);
    if (error) {
      const errorDict: Record<string, string> = {};
      error.issues.forEach((issue) => {
        const key = issue.path.join("");
        errorDict[key] = issue.message;
      });

      console.log(errorDict);
      setValidationErrors(errorDict);
    } else {
      setValidationErrors({});
    }
  }, [input]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Log In</IonTitle>
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
            <p>Welcome back!</p>
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
            Login
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
